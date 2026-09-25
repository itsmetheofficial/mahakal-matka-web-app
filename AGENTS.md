# Mahakal production deployment

- Deploy this frontend only to `play.mahakalmatka.com` (`/home/ganga786/public_html/cache_files_dont_delete/play.mahakalmatka.com`).
- Deploy its Laravel backend only to `api.mahakalmatka.com` (`/home/ganga786/public_html/cache_files_dont_delete/api.mahakalmatka.com`).
- Do not publish this frontend to `app.mahakalmatka.com`.
- Back up the affected live files before publishing and verify the active HTML references the new bundle with matching checksums afterward.
- For this project, publish completed backend changes to `api.mahakalmatka.com` and completed frontend changes to `play.mahakalmatka.com` as part of implementation, unless the user explicitly asks not to publish or requests read-only diagnosis/review.
