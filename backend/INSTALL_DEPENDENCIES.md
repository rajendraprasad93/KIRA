# Quick Fix: Install Missing Dependencies

## Error
```
ModuleNotFoundError: No module named 'piexif'
```

## Solution

Run this command in your terminal:

```bash
cd C:\Users\rajad\KIRA\backend
pip install piexif imagehash Pillow python-magic-bin geopy
```

After installation completes, restart the server:

```bash
python run.py
```

## Verify Installation

Check if modules are installed:

```bash
pip list | findstr piexif
pip list | findstr imagehash
pip list | findstr Pillow
```

You should see:
- piexif (1.1.3 or higher)
- imagehash (4.3.1 or higher)  
- Pillow (10.0.0 or higher)
- python-magic-bin (0.4.14 or higher)
- geopy (2.4.0 or higher)
