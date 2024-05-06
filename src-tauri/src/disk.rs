use fuzzy_matcher::skim::SkimMatcherV2;
use fuzzy_matcher::FuzzyMatcher;
use indicatif::{ProgressBar, ProgressStyle};
use rayon::iter::{IntoParallelIterator, IntoParallelRefIterator, ParallelIterator};
use serde::{Deserialize, Serialize};
use std::{
    collections::HashMap,
    io,
    path::{Path, PathBuf},
};
use sysinfo::{Disk, System};
use walkdir::WalkDir;

const MINIMUM_SCORE: i16 = 80;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub enum FileType {
    Directory,
    File,
}

#[derive(Clone)]
pub struct DiskStruct {
    name: String,
    mountpoint: PathBuf,
    available_gb: u16,
    used_gb: u16,
    total_gb: u16,
    map: HashMap<PathBuf, Vec<PathBuf>>,
}

impl DiskStruct {
    fn from(disk: &Disk, window: tauri::Window) -> Self {
        let used_bytes = disk.total_space() - disk.available_space();
        let available_gb = bytes_to_gb(disk.available_space());
        let used_gb = bytes_to_gb(used_bytes);
        let total_gb = bytes_to_gb(disk.total_space());

        let name = {
            let volume_name = disk.name().to_str().unwrap();
            match volume_name.is_empty() {
                true => "Local Volume",
                false => volume_name,
            }
            .to_string()
        };

        let mountpoint = disk.mount_point().to_path_buf();
        let cloned_mountpoint = mountpoint.clone();

        let tree_structure = create_tree(cloned_mountpoint, used_gb, window);

        Self {
            name,
            available_gb,
            used_gb,
            total_gb,
            mountpoint,
            map: tree_structure.unwrap(),
        }
    }

    pub fn name(&self) -> &String {
        &self.name
    }

    pub fn get_mountpoint(&self) -> &PathBuf {
        &self.mountpoint
    }

    pub fn search(&self, query: &str) -> Vec<(&PathBuf, FileType)> {
        let matcher = SkimMatcherV2::default().smart_case();
        let mut results = Vec::new();

        let len = self.map.len();
        println!("Searching in {} directories", len);

        for paths in self.map.values() {
            for path in paths {
                let filename = match path.file_name() {
                    Some(name) => name.to_string_lossy().into_owned(),
                    None => continue,
                };
                if check_file_name(&matcher, &filename, query) {
                    let file_type = if path.is_dir() {
                        FileType::Directory
                    } else {
                        FileType::File
                    };
                    results.push((path, file_type, score_filename(&matcher, &filename, query)));
                }
            }
        }

        // Sort results based on score in descending order
        results.sort_by_key(|&(_, _, score)| std::cmp::Reverse(score));

        // Extract paths from sorted results
        let sorted_paths: Vec<(&PathBuf, FileType)> = results
            .iter()
            .map(|&(path, file_type, _)| (path, file_type))
            .collect();

        sorted_paths
    }
}

pub fn get_disks(window: tauri::Window) -> Result<Vec<DiskStruct>, ()> {
    let mut system = System::new_all();
    system.refresh_all();

    let disks = sysinfo::Disks::new_with_refreshed_list();

    let disks_list = disks
        .par_iter()
        .map(|disk| {
            let disk = DiskStruct::from(disk, window.clone());
            disk
        })
        .collect();

    Ok(disks_list)
}

fn bytes_to_gb(bytes: u64) -> u16 {
    (bytes / 1_000_000_000) as u16
}

// Slowest function
pub fn create_tree(
    mountpoint: PathBuf,
    used_gb: u16,
    window: tauri::Window,
) -> Result<HashMap<PathBuf, Vec<PathBuf>>, io::Error> {
    let start = std::time::Instant::now();

    // Convert used_gb to bytes
    let used_bytes = used_gb as u64 * 1_073_741_824; // Convert GB to bytes

    // Create a progress bar for collecting paths
    let pb_collect = ProgressBar::new(used_bytes);
    pb_collect.set_style(ProgressStyle::default_bar());

    // Counter to track progress update events
    let mut emit_counter = 0;
    const EMIT_THRESHOLD: usize = 5000;

    // Recursively walk the directory and collect paths into a Vec
    let paths: Vec<PathBuf> = WalkDir::new(&mountpoint)
        .into_iter()
        .filter_map(Result::ok)
        .inspect(|entry| {
            if let Ok(metadata) = entry.metadata() {
                let file_size = metadata.len(); // Get file size in bytes
                let percent = (pb_collect.position() as f64) / (used_bytes as f64) * 100.0; // Calculate percentage with decimals

                pb_collect.inc(file_size);

                // Emit progress update event every EMIT_THRESHOLD times
                emit_counter += 1;
                if emit_counter >= EMIT_THRESHOLD {
                    window
                        .emit("update_progress", (mountpoint.clone(), percent))
                        .expect("Failed to emit progress update event");
                    emit_counter = 0;
                }
            }
        })
        .map(|entry| entry.into_path())
        .collect();

    pb_collect.finish_with_message("Paths collection completed");

    // Emit the last progress update event if necessary
    if emit_counter > 0 {
        let percent = (pb_collect.position() as f64) / (used_bytes as f64) * 100.0;
        window
            .emit("update_progress", (mountpoint.clone(), percent))
            .expect("Failed to emit progress update event");
    }

    let result: HashMap<PathBuf, Vec<PathBuf>> = paths
        .into_par_iter()
        .fold(
            || HashMap::new(),
            |mut map, path| {
                let parent = path.parent().unwrap_or_else(|| Path::new(""));
                map.entry(parent.to_path_buf())
                    .or_insert_with(Vec::new)
                    .push(path);
                map
            },
        )
        .reduce(HashMap::new, |mut map1, map2| {
            for (key, mut value) in map2 {
                map1.entry(key)
                    .and_modify(|v| v.append(&mut value))
                    .or_insert(value);
            }
            map1
        });

    window
        .emit("used_gb", (mountpoint.clone(), used_gb))
        .expect("Failed to emit progress update event");

    let elapsed = start.elapsed();
    println!("Tree created in {:?}", elapsed);
    Ok(result)
}

fn score_filename(matcher: &SkimMatcherV2, filename: &str, query: &str) -> i16 {
    if filename == query {
        return 1000;
    }
    matcher.fuzzy_match(filename, query).unwrap_or(0) as i16
}

fn check_file_name(matcher: &SkimMatcherV2, filename: &str, query: &str) -> bool {
    let score = score_filename(matcher, filename, query);
    score > MINIMUM_SCORE
}
