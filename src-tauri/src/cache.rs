use std::{collections::HashMap, path::PathBuf};

use crate::disk::{self, DiskStruct};

pub struct Cache {
    map: HashMap<PathBuf, DiskStruct>,
}

impl Cache {
    pub fn new(window: tauri::Window) -> Self {
        let res_map = create_disks(window);
        Self { map: res_map }
    }

    pub fn get_cache(&self) -> HashMap<PathBuf, DiskStruct> {
        self.map.clone()
    }
}

fn create_disks(window: tauri::Window) -> HashMap<PathBuf, DiskStruct> {
    println!("Gettings disks");
    let disks = disk::get_disks(window);

    let mut res = HashMap::new();

    match disks {
        Ok(disks) => {
            for disk in disks {
                let mountpoint = disk.get_mountpoint().to_path_buf();
                res.insert(mountpoint, disk);
            }
        }
        Err(_) => {
            println!("Failed to get disks");
        }
    }

    res
}
