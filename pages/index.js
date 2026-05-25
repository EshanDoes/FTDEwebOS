import Head from 'next/head';
import { useRef, useEffect, useState } from 'react';
import { preload } from 'react-dom';

import { Window, SimpleWindow, FileWindow, WindowDiv, WindowIcon, openWindow, Notification } from '../components/interactive.js'
import { Time } from '../components/live.js'

export default function Main(){
  const mainBody = useRef(null)
  const notifs = Notification()

  var output = <>
  <Head>
    <link rel="icon" href="/images/siteicon.png" />
    <title>██████ OS</title>
  </Head>
  <span className="onTop" id="bgOverlay" />
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
      <img src="/images/news/article2/header.png" className="fill" alt="A header image featuring a pen." />
        <h1>NEW WARREN'S RESTRUANT IN SPACE</h1>
        <p>The famously deadly food chain Warren's has decided to launch a restruant in the most unexpected location imaginable: space. They usually have their locations in either Utah or Ohio, which makes this decision extremely surprising.</p>
        <p>
          The new location has launched with an exclusive meal: the 40 Cent Special. It's the exact same as the 30 Cent Special, except they added 10 more cents to both the price and the plate. Many customers call this <q>a dissapointment to Warren's as a whole</q> because of the similaritiy to the 30 Cent Special. A few days after the announcement, a statement was made from Warren's adressing the 40 Cent Special. Here's an excerpt from their statement:
          <br />
          <br />
          <q>
            We believe that at Warren's, anything can happen, which we mean in the most literal way we possibly can. That is why we decided to make the 40 Cent Special; after all, it would be completely unexpected for us, which is what we at Warren's strive to do. We also try to strive to make food that kills you, but we haven't been up on that, and for that we apologize. We will try to do better on that department of Warren's.
          </q>
          <br />
          <br />
          There were mixed opinions on this statement. Some believe Warren's managed to pull out their biggest trick yet with this, others believe that Warren's priorities should be in making the food more unique than unexpected. Either way, one thing's for sure: they're still going to get customers in space, despite the little amount of people there.
        </p>
        <small>Wow, that was a much better ending than last article. I should try and work on these endings more, they're kinda important.</small>
        <br />
        <br />
        <br />
        <small style={{ placeSelf: "center" }}>Article 2 - May 1st, 2026 - Not updated every Friday</small>
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

  return (output);
}

function ContactForm(){
  const [formUnfilled, setFormUnfilled] = useState(true)
  const [errorFound, setErrorFound] = useState(false)
  const emailRef = useRef(null)
  const messageRef = useRef(null)
  const subjectRef = useRef(null)

  async function sendForm(e){
    e.preventDefault();
    setFormUnfilled(false)
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
      setErrorFound(true); // Allow retry on error
    }
  }
  function resetForm(){
    setFormUnfilled(true)
  }

  const form = <><p>Contact me!</p>
                <br />
                <form action="/hello" method="POST" autoComplete="off" onSubmit={sendForm}>
                <label htmlFor="subject">Subject:</label>
                <input type="text" id="subjectInput" name="subject" ref={subjectRef} />
                <br />
                <label htmlFor="email">E-mail:</label>
                <input type="email" id="emailInput" name="email" ref={emailRef} required />
                <br />
                <label htmlFor="message">Message:</label>
                <br />
                <textarea id="messageInput" name="message" ref={messageRef} required />
                <br />
                <input type="submit" value="Send" />
                <br />
                <span aria-live="polite"><p>At least one of the fields hasn't been filled out. Please fill out the field and resubmit.</p></span>
                </form>
              </>
  return (<>{ formUnfilled ? form : <>{ errorFound ? <p>Looks like an error occured when you tried to submit! Click the button below to try again.</p> : <p>Form sent! Now you can wait for a response...</p>}<button className="actualButton" onClick={resetForm}><p>Send another</p></button></>}</>)
}