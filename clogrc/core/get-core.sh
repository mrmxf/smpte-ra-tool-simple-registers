# usage> resources(sample)
# short> get core code & resources for cuttlebelle
#  long> download code & assest & theme from s3 so cuttlebelle builds the latest content
#                              _
#   ___  __ _   _ __    _ __  | |  ___
#  (_-< / _` | | '  \  | '_ \ | | / -_)
#  /__/ \__,_| |_|_|_| | .__/ |_| \___|
#                      |_|

source $GITPOD_REPO_ROOT/clogrc/core/mm-core-inc.sh
fnInfo "Project(${cH}$(basename $GITPOD_REPO_ROOT)${cT})$cF clogrc/core/get-core.sh$cX"
# ------------------------------------------------------------------------------

 CACHE="s3://mmh-cache"
   BOT="bot-bdh"
BRANCH="main"
  REPO="wmcb-core"

SRC="CB code & resources"
DST="$GITPOD_REPO_ROOT"

OPT="--include \"*\" --delete"
ACTION="Delete-Orpahns-Download"

# do preflight checks
source $GITPOD_REPO_ROOT/clogrc/core/s3sync.sh
fValidate
# ------------------------------------------------------------------------------

#define the folders to sync
SYNCS=(
  "$OPT  $CACHE/$BOT/$BRANCH/$REPO/code/core       $DST/code/core"
  "$OPT  $CACHE/$BOT/$BRANCH/$REPO/content/core    $DST/content/core"
  "$OPT  $CACHE/$BOT/$BRANCH/$REPO/r/c             $DST/r/c"
)

# do sync
fSync
