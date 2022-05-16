# usage> Gitpod [ before | init | command ]
# short> execute a gitpod boot command from the CLI
# long>  execute a gitpod boot command from the CLI
#        _
#   __  | |  ___   __ _
#  / _| | | / _ \ / _` |
#  \__| |_| \___/ \__, |
#                 |___/
# ------------------------------------------------------------------------------
fnDivider

source $GITPOD_REPO_ROOT/clogrc/core/mm-core-inc.sh
if [[ $1 == "" ]] ; then   echo -e "$cE Error$cT specify$cC before$cT |$cC init$cT |$cC command$cX" ; fi

# ------------------------------------------------------------------------------
#   ___   ___   ___    ___    ___   ___
#  | _ ) | __| | __|  / _ \  | _ \ | __|
#  | _ \ | _|  | _|  | (_) | |   / | _|
#  |___/ |___| |_|    \___/  |_|_\ |___|
# ------------------------------------------------------------------------------
if [[ $1 == "before" ]] ; then

  echo -e "${Cgreen}gitpod$cC BEFORE$cT tasks"

  fnInfo "$cC yarn$cT global path"
  PATH="$PATH:$(yarn global bin)"
  echo "PATH=\"$PATH\"" >> ~/.bashrc

  fnInfo "$cC  zmp$cT update"
  sudo wget --quiet --output-document=/usr/local/bin/zmp  https://mrmxf.com/get/zmp  ; sudo chmod +x /usr/local/bin/zmp

  fnInfo "$cC clog$cT update"
  sudo wget --quiet --output-document=/usr/local/bin/clog https://mrmxf.com/get/clog ; sudo chmod +x /usr/local/bin/clog

  fnInfo "$cC  aws$cT cli install"
  curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/tmp/awscliv2.zip"
  unzip -q -o /tmp/awscliv2.zip -d /tmp
  sudo /tmp/aws/install

  fnDivider

fi

# ------------------------------------------------------------------------------
#   ___   _  _   ___   _____
#  |_ _| | \| | |_ _| |_   _|
#   | |  | .` |  | |    | |
#  |___| |_|\_| |___|   |_|
# ------------------------------------------------------------------------------

if [[ $1 == "init" ]] ; then

  echo -e "${Cgreen}gitpod$cC INIT$cT tasks"
  fnDivider

fi

# ------------------------------------------------------------------------------
#    ___    ___    __  __   __  __     _     _  _   ___
#   / __|  / _ \  |  \/  | |  \/  |   /_\   | \| | |   \
#  | (__  | (_) | | |\/| | | |\/| |  / _ \  | .` | | |) |
#   \___|  \___/  |_|  |_| |_|  |_| /_/ \_\ |_|\_| |___/
# ------------------------------------------------------------------------------

if [[ $1 == "command" ]] ; then

  echo -e "${Cgreen}gitpod$cC COMMAND$cT tasks"
  fnDivider

fi
