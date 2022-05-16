# usage> stage
# short> execute stage.sh to build & upload {{REPO}} to staging
# long>  execute stage.sh to build & upload {{REPO}} to staging. No other option needed. Edit script to configure upload.
#                              _
#   ___  __ _   _ __    _ __  | |  ___
#  (_-< / _` | | '  \  | '_ \ | | / -_)
#  /__/ \__,_| |_|_|_| | .__/ |_| \___|
#                      |_|

source $GITPOD_REPO_ROOT/clogrc/core/mm-core-inc.sh
fnInfo "Project(${cH}$(basename $GITPOD_REPO_ROOT)${cT})$cF $(basename $0)"
# ------------------------------------------------------------------------------

 CACHE="s3://mmh-cache"
   BOT=$MM_BOT
BRANCH="staging"
  REPO=$(basename $GITPOD_REPO_ROOT)

SRC="some text for the UI prompt"

OPT="--include \"*\" "
ACTION=Upload

# do preflight checks & abort if user does not want to continue
source $GITPOD_REPO_ROOT/clogrc/core/s3sync.sh
fValidate
# ------------------------------------------------------------------------------

#define the folders to sync(upload) - one per line
SYNCS=(
  "$OPT site/folder1   $CACHE/$BOT/$BRANCH/$REPO/folder1"
  "$OPT site/folder2   $CACHE/$BOT/$BRANCH/$REPO/folder2"
)

# do sync
fSync

# do anything remedial like single file copies here....
