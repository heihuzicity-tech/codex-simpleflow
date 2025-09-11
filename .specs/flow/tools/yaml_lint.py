#!/usr/bin/env python3
import sys, json
try:
    import yaml  # type: ignore
except Exception as e:
    print(json.dumps({"ok": False, "error": "PyYAML not installed"}))
    sys.exit(0)

def main():
    ok = True
    result = []
    for path in sys.argv[1:]:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                yaml.safe_load(f)
            result.append({"path": path, "ok": True})
        except Exception as e:
            ok = False
            result.append({"path": path, "ok": False, "error": str(e)})
    print(json.dumps({"ok": ok, "files": result}, ensure_ascii=False))

if __name__ == '__main__':
    main()

