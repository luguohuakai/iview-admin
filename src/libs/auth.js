function access (str) {
  let access = 1 // 默认不展示(无权限)
  if (localStorage.accesses) {
    let accesses = JSON.parse(JSON.stringify(localStorage.accesses))
    if (accesses && accesses.indexOf(str) !== -1) {
      access = 0;
    }
  }

  return access
}

module.exports = {
  access: access
}