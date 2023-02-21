import '@wangeditor/editor/dist/css/style.css' // 引入 css

import React, { useState, useEffect } from 'react'
import { Editor, Toolbar } from '@wangeditor/editor-for-react'

export default function NewsEditor (props) {
  // editor 实例
  const [editor, setEditor] = useState(null)

  // 编辑器内容
  const [html, setHtml] = useState()

  // 模拟 ajax 请求，异步设置 html
  useEffect(() => {
    if (props.content) {
      setHtml(props.content)
    }
  }, [props.content])

  // 工具栏配置
  const toolbarConfig = {}

  // 编辑器配置
  const editorConfig = {
    placeholder: '请输入内容...',
  }

  // 及时销毁 editor ，重要！
  useEffect(() => {
    if (editor == null) return
    return () => {
      if (editor == null) return
      editor.destroy()
      setEditor(null)
    }
  }, [editor])

  return (
    <div>
      <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
        <Toolbar
          editor={editor}
          defaultConfig={toolbarConfig}
          mode="default"
          style={{ borderBottom: '1px solid #ccc' }}
        />
        <Editor
          defaultConfig={editorConfig}
          value={html}
          onCreated={setEditor}
          onChange={editor => {
            setHtml(editor.getHtml())
            props.getContext(editor.getHtml())
          }}
          mode="default"
          style={{ height: '350px', overflowY: 'hidden' }}
        />
      </div>
      {/* <div style={{ marginTop: '15px' }}>
        {html}
      </div> */}
    </div>
  )
}