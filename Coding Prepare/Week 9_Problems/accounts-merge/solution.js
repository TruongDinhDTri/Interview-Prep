  // ─── Demo: exercise mọi token cho theme ───
  const btn = document.getElementById('btn')
  let count = 0

  /* multiline comment
     để test better-comments */
  // ! đây là dòng cảnh báo (đỏ)
  // ? đây là câu hỏi (xanh dương)
  // todo nhớ refactor chỗ này (cam)
  // * điểm nhấn (xanh lá)

  function render() {
    btn.innerText = `Count: ${count}`   // template literal
  }

  btn.addEventListener('click', () => {
    // Count from 1 to 10.
    if (count < 10) {
      count += 1
      render()
    } else {
      console.log('Maxed out!', { count, done: true })
    }
  })

  const colors = ['#facdc0', '#fff825', '#27ffed']
  const doubled = colors.map((c, i) => ({ index: i, hex: c }))
