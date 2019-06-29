const runYarnLock = "yarn install --frozen-lockfile";

module.exports = {
  hooks: {
    "pre-commit": "lint-staged",
    "post-checkout": `if [[ $HUSKY_GIT_PARAMS =~ 1$ ]]; then ${runYarnLock}; fi`,
    "post-merge": runYarnLock,
    "post-rebase": "yarn install"
  }
};
