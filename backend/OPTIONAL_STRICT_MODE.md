# Optional: Strict EXIF Mode

If you want to experiment with requiring EXIF for certain cases, add this to .env:

```bash
# Strict mode - reject images without EXIF
# WARNING: Will reject WhatsApp, screenshots, social media images!
REQUIRE_EXIF=false  # Set to true for strict mode
```

Then in decision_engine.py, check this flag before making decision.

**But I strongly recommend keeping it FALSE** for general use!
