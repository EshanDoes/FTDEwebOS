import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import { preload } from 'react-dom';

import { Window, SimpleWindow, FileWindow, WindowDiv, WindowIcon, openWindow, Notification, Cursor } from '../components/interactive.js'
import { Time } from '../components/live.js'

export default function Main(){
  const mainBody = useRef(null)
  const notifs = Notification()

  var output = <>
  <Head>
    <link rel="icon" href="/images/siteicon.png" />
    <title>██████ OS</title>
  </Head>
  <span id="bgOverlay" />
  <img src="/images/ui/main/monitor.svg" id="monitorOverlay" />
  <div ref={mainBody} id="body">
    <div className="icons">
      <WindowIcon window="folderWindow" name="files" />
      <WindowIcon window="notesWindow" name="notes" />
      <WindowIcon window="game" />
      <WindowIcon window="news" />
      <WindowIcon window="contact" />
    </div>
    <WindowDiv>
    <Window windowName="notesWindow" contentStyle={{ minHeight: 0 }}><p contentEditable="true" spellCheck="false" /></Window>
    <Window windowName="gameWindow" windowStyle={{ padding: "16px 0px 0px 0px", height: 400 }}>
      <iframe
        frameBorder={0}
        src="https://itch.io/embed-upload/16855415?color=0f380f"
        allowFullScreen=""
        width={400}
        height={420}
        id="gameFrame"
        name="██████ Clicker"
      />
    </Window>
    <Window windowName="newsWindow">
      <img src="/images/news/finalarticle/header.png" className="fill" alt="A header image featuring a pen." />
        <h1>NEWS CANCELLED</h1>
        <p>I've gotten extremely busy. Like, really busy. I ended up having to bring these people to a shrine that says something about fate. With how busy I am, I've realized I can't commit to making news, so I'm cancelling it until further notice.</p>
        <br />
        <br />
        <p style={{ placeSelf: "center" }}><small>Article 3 - September 21st, 2026 - Not updated every Friday</small></p>
        {/*<p style="text-align: center;"><small>All articles taken from Mystery Man's Hobbyist News</small></p>*/}
    </Window>
    <Window windowName="contactWindow">
      <ContactForm />
    </Window>
    <Window windowName="touchscreenWindow">
      <h1>NOTICE</h1>
      <p>
          This site doesn't work well on touchscreen devices! You can try to use
          it, just know that it'll be very broken with features like dragging
          windows and I am still working on proper touchscreen compatability.
          Feel free to close this window if you think you'll still be able to
          use it.
      </p>
    </Window>
    </WindowDiv>
    <div
      id="options"
      className="onTop animated"
      style={{ bottom: "calc(-40% - 32px)", visibility: "hidden" }}
    >
      <p>Options</p>
      <br />
      <p /*onClick={toggleOption('animations')}*/ >
        <img className="checkbox" id="animationsCheckbox" /> Enable animations
      </p>
    </div>
    <div className="bottombar onTop">
      <Time />
      <span style={{ width: 4, height: "100%", backgroundColor: "#306230" }} />
      <a href="https://discord.gg/ENChZjqFBx" aria-label="Join the Technical Difficulties Discord server">
        <img src="/images/ui/icons/bottombar/chat.png" alt="A chat icon under the link to a Discord server." />
      </a>
      {notifs[0]}
    </div>
    {notifs[1]}
  </div>
</>

  useEffect(() => {
    mainBody.current.addEventListener('scroll', evt => {
      evt.target.scrollTop = 0;
      evt.target.scrollLeft = 0;
    });
    if("ontouchstart" in document.documentElement){
      const disclaimerInfo = document.getElementById("touchscreenWindow").getBoundingClientRect()
      openWindow("touchscreenWindow", {
        clientX: window.innerWidth / 2 - disclaimerInfo.width / 2,
        clientY: window.innerHeight / 2 - disclaimerInfo.height / 2
      })
    }
  }, [openWindow])
  function shakeBody(){
      document.getElementById("body").style.transform = "translate("+(Math.random()*12-6)+"px, "+(Math.random()*12-6)+"px)";
      requestAnimationFrame(shakeBody)
  }
  useEffect(() => {window.shakeBody = shakeBody}, [shakeBody])

  preload('/images/ui/icons/files/folder.png', {as: 'image'})
  preload('/images/ui/icons/files/image.png', {as: 'image'})
  preload('/images/ui/icons/files/text.png', {as: 'image'})
  preload('/images/ui/icons/files/html.png', {as: 'image'})

   /* useEffect(() => {
    let deselectButtons = document.querySelectorAll("button, a").forEach(function(e) {
      e.addEventListener("click", () => {
        setTimeout(func => {
          e.tabIndex = -1
          e.tabIndex = 0
          document.body.focus()
        }, 0)
      })
    })
  }) */

  return (output);
}

function ContactForm(){
  const [formUnfilled, setFormUnfilled] = useState(true)
  const [errorFound, setErrorFound] = useState(false)
  const formRef = useRef(null)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const subjectRef = useRef(null)
  const invalidFormRef = useRef(null)

  async function sendForm(e){
    e.preventDefault();
    if (emailRef.current.value == "" || messageRef.current.value == ""){
      setErrorFound(true)
    }
    else {
      setFormUnfilled(false) 
      setErrorFound(false)
      try {
        const res = await fetch('/api/contact', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailRef.current.value,
            subject: subjectRef.current.value,
            message: messageRef.current.value,
          }),
        });
        if (!res.ok) throw new Error('Upload failed');
      } catch (error) {
        console.error(error);
        setErrorFound(true);
      }
    }
  }
  function resetForm(){
    setFormUnfilled(true)
    setErrorFound(false)
  }

  /* useEffect(() => {
    const form = formRef.current
    const popup = invalidFormRef.current
    const email = emailRef.current
    const message = messageRef.current

    form.addEventListener("submit", (e) => {
      e.preventDefault()

      if(!email.checkValidity() || !message.checkValidity()){
        popup.style.display = "default"
      }
      console.log("Form submission")
    })
  }, [formRef, invalidFormRef]) */

  const form = <><p>Contact me!</p>
                <br />
                <form action="/hello" method="POST" autoComplete="off" onSubmit={sendForm} ref={formRef}>
                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subjectInput" name="subject" ref={subjectRef} autoComplete="off" />
                <br />
                <label htmlFor="emailInput">E-mail:</label>
                <input type="email" id="emailInput" name="emailInput" ref={emailRef} autoComplete="off" placeholder="Required" />
                <br />
                <label htmlFor="message">Message:</label>
                <br />
                <textarea id="messageInput" name="message" ref={messageRef} autoComplete="off" placeholder="Required" />
                <br />
                {errorFound && <span ref={formRef}><p>At least one of the fields hasn't been filled out properly. Please fill out the field and resubmit.</p></span>}
                <br />
                <input type="submit" className="actualButton" value="Send" />
                </form>
              </>
  return (<>{ formUnfilled ? form : <>{ errorFound ? <p>Looks like an error occured when you tried to submit! Click the button below to try again.</p> : <p>Form sent! Now you can wait for a response...</p>}<button className="actualButton" onClick={resetForm}>Send another</button></>}</>)
}