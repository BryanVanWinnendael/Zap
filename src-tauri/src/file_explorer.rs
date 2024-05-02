use crate::cache::Cache;
use crate::disk::FileType;
use std::collections::HashMap;
use std::path::PathBuf;
use std::sync::Arc;

pub struct FileExplorer {
    cache: Cache,
}

impl FileExplorer {
    pub fn new(window: tauri::Window) -> Self {
        println!("Creating cache");
        let start = std::time::Instant::now();
        let cache = Cache::new(window);
        let elapsed = start.elapsed();
        println!("Cache created in {:?}", elapsed);
        Self { cache }
    }

    pub fn search(&self, query: &str) -> HashMap<PathBuf, Vec<(PathBuf, FileType)>> {
        let cache_map = self.cache.get_cache();
        let mut results = HashMap::new();
        let query = Arc::new(query.to_owned()); // Convert query to Arc<String>
        println!("Searching for {:?}", query);
        for (mountpoint, disk) in cache_map {
            let start = std::time::Instant::now();
            println!("Searching in {}", mountpoint.display());
            let res = disk.search(&query); // Use the cloned Arc<String>
            let elapsed = start.elapsed();
            println!(
                "Search completed in {:?} for mountpoint {:?} with query {:?}",
                elapsed, mountpoint, query
            );
            let owned_res: Vec<(PathBuf, FileType)> = res
                .into_iter()
                .map(|(path, file_type)| (path.to_owned(), file_type))
                .collect();
            results.insert(mountpoint.clone(), owned_res);
        }

        // Print length of results
        for (key, value) in &results {
            println!("{}: {}", key.display(), value.len());
        }

        results
    }
}
