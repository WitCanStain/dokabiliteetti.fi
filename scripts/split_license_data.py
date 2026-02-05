#!/usr/bin/env python3
"""
Script to download an Excel file containing alcohol license data,
split it into multiple CSV files of 500 rows each, and save with number suffixes.
"""

import os
import sys
import pandas as pd
import requests
from pathlib import Path
from typing import Optional

# Configuration
URL = "https://avoindata.suomi.fi/data/dataset/80ebd0dc-6496-4919-958f-8b0a29af0466/resource/54de813d-4ed0-4e5e-9d57-418df5831654/download/luparekisteri-voimassaolevat-alkoholiluvat.xlsx"
CHUNK_SIZE = 500
OUTPUT_DIR = Path(__file__).parent.parent / "data" / "license_chunks"
TEMP_FILE = Path("/tmp/license_data.xlsx")


def download_file(url: str, output_path: Path, timeout: int = 30) -> bool:
    """
    Download file from URL and save to output_path.
    
    Args:
        url: URL to download from
        output_path: Path to save the file
        timeout: Request timeout in seconds
        
    Returns:
        True if successful, False otherwise
    """
    try:
        print(f"Downloading file from {url}...")
        response = requests.get(url, timeout=timeout)
        response.raise_for_status()
        
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'wb') as f:
            f.write(response.content)
        
        file_size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"✓ Downloaded successfully ({file_size_mb:.2f} MB)")
        return True
        
    except requests.RequestException as e:
        print(f"✗ Failed to download file: {e}", file=sys.stderr)
        return False
    except IOError as e:
        print(f"✗ Failed to save file: {e}", file=sys.stderr)
        return False


def read_excel(file_path: Path) -> Optional[pd.DataFrame]:
    """
    Read Excel file into DataFrame.
    
    Args:
        file_path: Path to Excel file
        
    Returns:
        DataFrame if successful, None otherwise
    """
    try:
        print(f"Reading Excel file: {file_path}")
        df = pd.read_excel(file_path)
        print(f"✓ Loaded {len(df)} rows with {len(df.columns)} columns")
        return df
        
    except Exception as e:
        print(f"✗ Failed to read Excel file: {e}", file=sys.stderr)
        return None


def split_and_save(df: pd.DataFrame, output_dir: Path, chunk_size: int = 500) -> bool:
    """
    Split DataFrame into chunks and save as CSV files with number suffixes.
    
    Args:
        df: DataFrame to split
        output_dir: Directory to save chunk files
        chunk_size: Number of rows per chunk
        
    Returns:
        True if successful, False otherwise
    """
    try:
        output_dir.mkdir(parents=True, exist_ok=True)
        
        num_chunks = (len(df) + chunk_size - 1) // chunk_size
        print(f"\nSplitting into {num_chunks} files of {chunk_size} rows each...")
        
        for i in range(num_chunks):
            start_idx = i * chunk_size
            end_idx = min((i + 1) * chunk_size, len(df))
            
            chunk = df.iloc[start_idx:end_idx]
            
            # Use 1-based numbering for user-friendly output
            chunk_num = i + 1
            output_file = output_dir / f"license_data_{chunk_num}.csv"
            
            chunk.to_csv(output_file, index=False, encoding='utf-8')
            
            rows_in_chunk = len(chunk)
            print(f"  ✓ Saved {output_file.name} ({rows_in_chunk} rows)")
        
        print(f"\n✓ Successfully split data into {num_chunks} files")
        print(f"  Location: {output_dir}")
        return True
        
    except Exception as e:
        print(f"✗ Failed to split and save data: {e}", file=sys.stderr)
        return False


def cleanup_temp_file(file_path: Path) -> None:
    """Remove temporary file."""
    try:
        if file_path.exists():
            file_path.unlink()
            print(f"✓ Cleaned up temporary file: {file_path}")
    except OSError as e:
        print(f"⚠ Warning: Could not delete temporary file {file_path}: {e}")


def main() -> int:
    """
    Main entry point.
    
    Returns:
        0 on success, 1 on failure
    """
    print("=" * 60)
    print("Alcohol License Data Splitter")
    print("=" * 60)
    
    # Download file
    if not download_file(URL, TEMP_FILE):
        return 1
    
    # Read Excel file
    df = read_excel(TEMP_FILE)
    if df is None:
        cleanup_temp_file(TEMP_FILE)
        return 1
    
    # Split and save
    if not split_and_save(df, OUTPUT_DIR, CHUNK_SIZE):
        cleanup_temp_file(TEMP_FILE)
        return 1
    
    # Cleanup
    cleanup_temp_file(TEMP_FILE)
    
    print("\n" + "=" * 60)
    print("Done!")
    print("=" * 60)
    return 0


if __name__ == "__main__":
    sys.exit(main())
