import { useEffect, useRef, useState, useCallback } from 'react'

// Module-level variables for window management
let selectedWindow = undefined
let maxZ = 3

// Window animation variables
let lastUpdate = null
let delta = 0
let animatedWindow
let animationOffset = 8
const animationLength = 150.0

// Selecting/deselecting windows
export function selectWindow(element) {
  if (selectedWindow != undefined) {
    selectedWindow.classList.remove("selected")
  }
  selectedWindow = element
  selectedWindow.classList.add("selected")
  maxZ++
  selectedWindow.style.zIndex = maxZ
}

export function deselectWindow(element) {
  element.classList.remove("selected")
}

// Window animation
export function startWindowAnim(element) {
  animatedWindow = element
  delta = 0
  requestAnimationFrame(windowAnim)
}

function windowAnim() {
  if (delta < animationLength) {
    if (lastUpdate == null) {
      lastUpdate = Date.now()
    }
    var now = Date.now()
    delta += now - lastUpdate
    lastUpdate = now
    animatedWindow.style.transform = "translate(0, " + Math.round(animationOffset - (Math.sin(delta / animationLength * Math.PI / 2)) * animationOffset) + "px)"
    requestAnimationFrame(windowAnim)
  } else {
    lastUpdate = null
    animatedWindow.style.transform = "translate(0px, 0px)"
  }
}

// Open window function (adapted for React)
export function openWindow(openedWindow, event = null) {
  const openingWindow = document.getElementById(openedWindow)
  if (!openingWindow) return
  openingWindow.style.visibility = "visible"
  
  const mainBody = document.getElementById('body') // Adjust if your main container has a different ID
  if (!mainBody) return
  
  let windowTop, windowLeft
  if (event) {
    windowTop = event.clientY - (window.innerHeight - mainBody.getBoundingClientRect().height) / 2
    windowLeft = event.clientX - (window.innerWidth - mainBody.getBoundingClientRect().width) / 2
  } else {
    // Default positioning if no event (set to 16px manually)
    windowTop = 16
    windowLeft = 16
  }
  
  // Boundary checks
  if (mainBody.getBoundingClientRect().height - (windowTop + openingWindow.getBoundingClientRect().height) < 36) {
    windowTop = mainBody.getBoundingClientRect().height - openingWindow.getBoundingClientRect().height - 46
  }
  if (mainBody.getBoundingClientRect().width - (windowLeft + openingWindow.getBoundingClientRect().width) < 0) {
    windowLeft = mainBody.getBoundingClientRect().width - openingWindow.getBoundingClientRect().width - 6
  }
  if (windowTop < 0) {
    windowTop = 4
  }
  
  openingWindow.style.top = windowTop + "px"
  openingWindow.style.left = windowLeft + "px"
  selectWindow(openingWindow)
  startWindowAnim(openingWindow)
}

function setIframePointerEvents(value) {
  document.querySelectorAll('iframe').forEach((iframe) => {
    iframe.style.pointerEvents = value
  })
}

export function handleWindowInteraction(windowRef, headerRef, xButtonRef) {
  const dragState = useRef({
    dragging: false,
    startX: 0,
    startY: 0
  })
  const maxZ = useRef(0)
  useEffect(() => {
    const element = windowRef.current
    const handle = headerRef?.current ?? element
    const xButton = xButtonRef?.current ?? element
    if (!element || !handle) return

    // Dragging code
    function onMouseDown(e) {
      e.preventDefault()
      dragState.current.dragging = true
      dragState.current.startX = e.clientX - element.getBoundingClientRect().left;
      dragState.current.startY = e.clientY - element.getBoundingClientRect().top;

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
      setIframePointerEvents('none');
    }

    function onMouseMove(e) {
      if (!dragState.current.dragging) return
      e.preventDefault()

      const dx = e.clientX - dragState.current.startX
      const dy = e.clientY - dragState.current.startY

      const rect = element.getBoundingClientRect()
      element.style.top = `${dy - element.parentElement.getBoundingClientRect().top}px`
      element.style.left = `${dx - element.parentElement.getBoundingClientRect().left}px`
    }

    function onMouseUp() {
      dragState.current.dragging = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      setIframePointerEvents('auto')
    }

    function xButtonClick() {
        element.style.visibility = "hidden";
    }

    handle.addEventListener('mousedown', onMouseDown)
    xButton.addEventListener('click', xButtonClick)
    element.addEventListener('mousedown', function (e) {selectWindow(this);})

    return () => {
      handle.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [windowRef, headerRef, xButtonRef])
}

// Most code before this comment is written by AI at first, but read through and modified with human hands. I've made sure to go through and fix any bugs on my own.

import { StrictMode } from 'react';
import files from '../pages/files.json'

var currentDir = []

export function SimpleWindow({ windowName, children, windowStyle = {}, headerStyle = {}, headerChildren = <></> }) {
  const windowRef = useRef(null)
  const headerRef = useRef(null)
  const xButtonRef = useRef(null)

  handleWindowInteraction(windowRef, headerRef, xButtonRef)

  return (
    <div ref={windowRef} id={windowName} className="window" style={windowStyle}>
      <div ref={headerRef} className="header" id={`${windowName}header`} style={headerStyle}>
        {headerChildren}
        <button className="xButton" ref={xButtonRef}><img src="/images/ui/main/x.png" alt="An X button on a window meant to close the window." /></button>
      </div>
      {children}
    </div>
  )
}
export function Window({ windowName, children, windowStyle = {}, headerStyle = {}, contentStyle = {} }){
    return (
    <SimpleWindow windowName={windowName} windowStyle={windowStyle} headerStyle={headerStyle}>
        <div className="windowContent" style={contentStyle}>
            {children}
        </div>
    </SimpleWindow>)
}
export function FileWindow({ windowRef, contentRef, backRef }){
  return (
    <SimpleWindow ref={windowRef} windowName="folderWindow" headerChildren={
      <button className="backButton" ref={backRef}><img src="/images/ui/main/back.png" alt="A back button meant for going to the previous folder." /></button>
    }>
      <div ref={contentRef} className="windowContent"><p>Test</p></div>
    </SimpleWindow>
  )
}

export function WindowIcon({ window, name = window }){
    var linkedWindow
    if (window == name){
        linkedWindow = window + "Window"
    } else {
        linkedWindow = window
    }
    return (<button onClick={(e) => openWindow(linkedWindow, e)}><img src={"/images/ui/icons/apps/"+name+".png"} alt={"An icon that can be clicked to open a "+name+" window."} /></button>)
}

function openFile(directory = []){
  let fileSearch = files
  for(let i = 0; i < directory.length; i++){
    fileSearch = fileSearch.content[directory[i]]
  }
  return fileSearch
}

export function WindowDiv({ children }){
  const fileWindow = useRef(null)
  const fileDiv = useRef(null)
  const windowDiv = useRef(null)
  const backButton = useRef(null)
  const [addedWindows, setAddedWindows] = useState([])
  
  const addWindow = useCallback((dir, file, event) => {
    setAddedWindows(prev => {
      const key = `w${dir.join('-')}`
      setTimeout(() => openWindow(key, event), 0)
      // Avoid duplicates
      if (prev.find(w => w.key === key)) {
        return prev
      }
      return [...prev, { key, dir, file }]
    })
  }, [])
  
  fileSystem(fileWindow, fileDiv, windowDiv, backButton, addWindow)
  
  // Start of a small bit of AI code
  const renderWindow = (item) => {
    const { key, dir, file } = item
    switch (file.type) {
      case 'image':
        return <ImageFileWindow key={key} dir={dir} />
      case 'text':
        return <TextFileWindow key={key} dir={dir} />
      default:
        return <ContentFileWindow key={key} dir={dir} />
    }
  }
  // End of a small bit of AI code

  useEffect(() => {window.openWindow = openWindow}, [openWindow])
  
  return (<div ref={windowDiv} id="windows">
    {children}
    <FileWindow windowRef={fileWindow} contentRef={fileDiv} backRef={backButton} />
    {addedWindows.map(renderWindow)}
  </div>);
}

export function fileSystem(fileWindow, fileDiv, windowDiv, backButton, addWindow){
  useEffect(() => {
    const element = fileWindow.current
    const content = fileDiv.current
    const windows = windowDiv.current
    const back = backButton.current

    function openRelativeFile(directory, e = null){
      if(Array.isArray(directory) == false){directory = [directory];}
      let file = openFile(currentDir.concat(directory))
      if(file.type == "folder"){
        if(currentDir[0] != 4 && currentDir[1] != 0){
          currentDir.push(directory)
        }
        openFolder()
      } else {
        // It's a file, not a folder - add it to the windows array
        addWindow(currentDir.concat(directory), file, e)
      }
    }
    function openFolder(directory = currentDir){
      if(currentDir != directory){currentDir = directory}
      var currentFiles = openFile(directory).content
      content.innerHTML = ""
      for(let i = 0; i < currentFiles.length; i++){
        const fileItem = document.createElement('p')
        fileItem.className = 'hoverable'
        fileItem.innerHTML = '<img class="fileIcons" src="/images/ui/icons/files/' + currentFiles[i].type + '.png">' + currentFiles[i].name
        fileItem.addEventListener('click', (e) => {
          openRelativeFile(i, e)
        })
        content.appendChild(fileItem)
      }
      startWindowAnim(document.getElementById("folderWindow"))
      selectWindow(document.getElementById("folderWindow"))
    }
    function closeFolder(){
      currentDir.pop()
      openFolder()
    }

    back.addEventListener("click", closeFolder)
    window.addEventListener('keyup', (e) => {if(e.code == "Escape"){closeFolder()}})
    window.openFolder = openFolder
    openFolder([])
  }, [fileWindow, fileDiv, windowDiv, backButton, addWindow])
}

export function ImageFileWindow({ dir, content = null }){
  if(content == null){
    content = openFile(dir).content
  }
  var windowName = "w" + dir.join("-")
  return <SimpleWindow key={windowName} windowName={windowName}><img src={content} /></SimpleWindow>
}
export function TextFileWindow({ dir, content = null }){
  if(content == null){
    content = openFile(dir).content
  }
  var windowName = "w" + dir.join("-")
  const contentRef = useRef(null)
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content
    }
  }, [content])

  return <SimpleWindow key={windowName} windowName={windowName} contentStyle={{ minHeight: 0 }}><div className="windowContent"><p ref={contentRef} contentEditable="true" spellCheck="false"></p></div></SimpleWindow>
}
export function ContentFileWindow({ dir, content = null }){
  if(content == null){
    content = openFile(dir).content
  }
  var windowName = "w" + dir.join("-")
  const contentRef = useRef(null)
  
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.innerHTML = content
    }
  }, [content])
  
  return (
    <SimpleWindow key={windowName} windowName={windowName}>
      <div ref={contentRef} className="windowContent"></div>
    </SimpleWindow>
  )
}

export function Notification(){
  const notifsHidden = useRef(true)
  const notifButton = useRef(null)
  const notifDiv = useRef(null)

  function toggleNotifs(){
    if(notifsHidden.current){
      notifsHidden.current = false
      notifDiv.current.classList.add("open")
    } else{
      notifsHidden.current = true
      notifDiv.current.classList.remove("open")
    }
  }

  function NotifButton(){
    return (<button
            id="notifButton"
            onClick={toggleNotifs}
            ref={notifButton}
          >
            <img alt="A notifications button which shows no new notifications." src="/images/ui/icons/bottombar/notif.png" />
          </button>)
  }
  function NotifDiv(){
    return (<div
            className={`notifs onTop animated`}
            id="notifs"
            ref={notifDiv}
          >
            <div>
              <p>No notifications...</p>
            </div>
          </div>)
  }

  return([<NotifButton />, <NotifDiv />])
}