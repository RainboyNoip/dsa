#!/usr/bin/env bash

set -Eeuo pipefail

readonly remote_host="bohai"
readonly remote_directory="/www/wwwroot/anima1.roj.ac.cn/"
readonly script_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly project_directory="$(cd -- "${script_directory}/.." && pwd)"
readonly source_directory="${project_directory}/public/"

show_usage() {
  cat <<'EOF'
用法：scripts/sync-to-bohai.sh [--dry-run]

将本地 public/ 的内容同步到：
  bohai:/www/wwwroot/anima1.roj.ac.cn/

选项：
  --dry-run  只显示将发生的变更，不修改远端文件
  -h, --help 显示帮助

正式同步会删除远端中本地已不存在的文件，但保留远端 .well-known/ 目录和 .user.ini 文件。
EOF
}

dry_run=false

while (($# > 0)); do
  case "$1" in
    --dry-run)
      dry_run=true
      ;;
    -h|--help)
      show_usage
      exit 0
      ;;
    *)
      printf '未知参数：%s\n\n' "$1" >&2
      show_usage >&2
      exit 2
      ;;
  esac
  shift
done

for command_name in rsync ssh; do
  if ! command -v "$command_name" >/dev/null 2>&1; then
    printf '缺少命令：%s\n' "$command_name" >&2
    exit 1
  fi
done

if [[ ! -d "$source_directory" || ! -f "${source_directory}index.html" ]]; then
  printf '部署源无效：%s\n' "$source_directory" >&2
  exit 1
fi

if [[ "$remote_directory" != "/www/wwwroot/anima1.roj.ac.cn/" ]]; then
  printf '拒绝同步到未授权目录：%s\n' "$remote_directory" >&2
  exit 1
fi

printf '部署源：%s\n' "$source_directory"
printf '远端目标：%s:%s\n' "$remote_host" "$remote_directory"

if [[ "$dry_run" == true ]]; then
  printf '模式：预演，不修改远端文件\n'
else
  printf '模式：正式同步，远端多余文件将在传输结束后删除\n'
fi

if ! ssh "$remote_host" "test -d '$remote_directory' && test -w '$remote_directory'"; then
  printf '远端目录不存在或不可写：%s:%s\n' "$remote_host" "$remote_directory" >&2
  exit 1
fi

rsync_options=(
  --archive
  --compress
  --delete-delay
  --delay-updates
  --human-readable
  --itemize-changes
  --no-group
  --no-owner
  --omit-dir-times
  --exclude=/.well-known/
  --exclude=/.user.ini
)

if [[ "$dry_run" == true ]]; then
  rsync_options+=(--dry-run)
fi

rsync \
  "${rsync_options[@]}" \
  "$source_directory" \
  "${remote_host}:${remote_directory}"

if [[ "$dry_run" == true ]]; then
  printf '预演完成；移除 --dry-run 后执行正式同步。\n'
else
  printf '同步完成：https://anima1.roj.ac.cn/\n'
fi
