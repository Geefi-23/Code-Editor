window.onload = function(){
  let editor = document.getElementById('editor')
  let preview = document.getElementById('preview')
  let btnSave = document.querySelector('#btn-save')

  btnSave.onclick = function(){
    saveCode()
  }
  editor.oninput = function(e){
    preview.innerHTML = '<pre>' + applyTextStyle(this.value) + '</pre>'
  }
  editor.addEventListener('keydown', function(e){
    featureKey(e, this, preview)
  })
}

//aplica os estilos no código (disponiveis em codeStyle.css)
function applyTextStyle(text){
  let regex = {
    keywords: /(\b(?:var|let|function|if|else|switch|case|for|while|break)\b)/g,
    functions: /(\w+\((.*,? ?)*\))/g,
    strings: [/(".+")/g, /('.+')/g],
    comments: [/(\/\/.*(?:\n)?)/g, /(\/\*(?:.|\n)*\*\/)/g],
    objects: /(\w+\.)/g,
    operators: /(\+|-|(?<=\d(?: *))\*|\=)/g
  }
  
  text = text.replaceAll(regex.strings[0], '<span class="string">$1</span>')
  text = text.replaceAll(regex.strings[1], '<span class="string">$1</span>')
  text = text.replaceAll(regex.operators, '<span class="operator">$1</span>')
  text = text.replaceAll(regex.functions, '<span style="color: pink">$1</span>')
  text = text.replaceAll(regex.keywords, '<span class="keyword">$1</span>')
  text = text.replaceAll(regex.objects, '<span class="object">$1</span>')
  text = text.replaceAll(regex.comments[0], '<span class="comment">$1</span>')
  text = text.replaceAll(regex.comments[1], '<span class="comment">$1</span>')
  
  
  return text
}

//funções especiais de algumas teclas
function featureKey(e, targetElement, preview){
  let finalKey
  let start = targetElement.selectionStart
  let end = targetElement.selectionEnd
  let finalSelection
  let value = targetElement.value
  switch(e.key){
    case 'Tab':
      finalKey = '  '
      e.preventDefault()
      finalSelection = start + 2
      break
    case 'Enter':
      if (targetElement.value[start - 1] === '{'
        && targetElement.value[end] === '}'){
        finalKey = '\n  \n'
        e.preventDefault()
        finalSelection = start + 3
      }
      break
    case '"':
      finalKey = '""'
      finalSelection = start + 1
      break
    case '\'':
      finalKey = '\'\''
      finalSelection = start + 1
      break
    case '(':
      finalKey = '()'
      finalSelection = start + 1
      break
    case '{':
      finalKey = '{}'
      finalSelection = start + 1
      break
    case '[':
      finalKey = '[]'
      finalSelection = start + 1
  }

  if (finalKey != null){
    e.preventDefault()
    
    value = value.substr(0, start) + finalKey + value.substr(end)

    targetElement.value = value
    preview.innerHTML = '<pre>' + applyTextStyle(value) + '</pre>'

    targetElement.selectionStart = targetElement.selectionEnd = finalSelection
  }
}

//converte o código para uma lista e renderiza na Preview
function saveCode(){ 
  let preview = document.querySelector('#preview')
  let code = preview.innerText

  let codeLines = code.split('\n')
  let finalFormat = ''
  codeLines.forEach(function(val){
    finalFormat += '<li>' + val + '</li>'
  })
  preview.innerHTML = '<pre><ol>' + applyTextStyle(finalFormat) + '</ol></pre>'
}