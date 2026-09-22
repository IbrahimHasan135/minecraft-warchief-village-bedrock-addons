#!/usr/bin/env python3
"""Package the Warchief Village add-on into a Bedrock .mcaddon file."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_OUTPUT = ROOT / "dist" / "Warchief_Village_Phase_03.mcaddon"
PACKS = (
    ("behavior_pack", "Warchief_Village_BP"),
    ("resource_pack", "Warchief_Village_RP"),
)
EXCLUDED_SUFFIXES = (".md", ".map")
EXCLUDED_NAMES = {".gitkeep"}


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Create a Minecraft Bedrock .mcaddon archive from behavior_pack and resource_pack."
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=DEFAULT_OUTPUT,
        help=f"Output .mcaddon path. Default: {DEFAULT_OUTPUT.relative_to(ROOT)}",
    )
    return parser.parse_args()


def should_include(path: Path) -> bool:
    if path.name in EXCLUDED_NAMES:
        return False
    return not path.name.endswith(EXCLUDED_SUFFIXES)


def read_manifest(pack_path: Path) -> dict:
    manifest_path = pack_path / "manifest.json"

    if not manifest_path.is_file():
        raise FileNotFoundError(f"Missing required manifest: {manifest_path.relative_to(ROOT)}")

    return json.loads(manifest_path.read_text(encoding="utf-8"))


def package(output_path: Path) -> None:
    output_path = output_path if output_path.is_absolute() else ROOT / output_path
    output_path.parent.mkdir(parents=True, exist_ok=True)

    if output_path.exists():
        output_path.unlink()

    added_files = 0

    with ZipFile(output_path, "w", ZIP_DEFLATED) as archive:
        for source_name, archive_name in PACKS:
            source_path = ROOT / source_name
            manifest = read_manifest(source_path)
            pack_label = manifest.get("header", {}).get("name", source_name)

            for path in sorted(source_path.rglob("*")):
                if not path.is_file() or not should_include(path):
                    continue

                archive_path = Path(archive_name) / path.relative_to(source_path)
                archive.write(path, archive_path.as_posix())
                added_files += 1

            print(f"Included {pack_label}: {archive_name}/")

    print(f"Created {output_path.relative_to(ROOT)} with {added_files} files.")


def main() -> None:
    args = parse_args()
    package(args.output)


if __name__ == "__main__":
    main()
