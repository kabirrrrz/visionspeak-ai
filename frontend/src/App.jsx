import { useState } from "react";
import axios from "axios";
import { Oval } from "react-loader-spinner";

function App() {

  const [image,setImage] = useState(null)
  const [text,setText] = useState("")
  const [audio,setAudio] = useState(null)

  const [ocrLoading,setOcrLoading] = useState(false)
  const [speechLoading,setSpeechLoading] = useState(false)

  const [language,setLanguage] = useState("en")
  const [darkMode,setDarkMode] = useState(false)

  const extractText = async () => {

    if(!image){
      alert("Upload an image first")
      return
    }

    const formData = new FormData()
    formData.append("image",image)

    try{

      setOcrLoading(true)

      const res = await axios.post(
        "http://127.0.0.1:5000/ocr",
        formData
      )

      setText(res.data.text)

    }catch(err){
      console.log(err)
      alert("OCR failed")
    }

    setOcrLoading(false)
  }


  const convertSpeech = async () => {

    if(!text){
      alert("No text available")
      return
    }

    try{

      setSpeechLoading(true)

      const res = await axios.post(
        "http://127.0.0.1:5000/tts",
        {text,language},
        {responseType:"blob"}
      )

      const url = URL.createObjectURL(res.data)

      setAudio(url)

    }catch(err){
      console.log(err)
      alert("Speech generation failed")
    }

    setSpeechLoading(false)
  }


  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    setImage(file)
  }


  return (

<div className={darkMode
  ? "min-h-screen bg-gray-900 text-white flex flex-col items-center p-10"
  : "min-h-screen bg-gray-100 text-black flex flex-col items-center p-10"
}>

<div className="flex justify-between w-full max-w-xl mb-6">

<h1 className="text-3xl font-bold text-blue-500">
VisionSpeak AI
</h1>

<button
onClick={()=>setDarkMode(!darkMode)}
className="bg-gray-700 text-white px-3 py-1 rounded"
>
{darkMode ? "Light Mode" : "Dark Mode"}
</button>

</div>

<p className="mb-6 text-gray-400">
AI Image → Text → Speech Converter
</p>


<div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 w-full max-w-xl">


{/* Drag Drop Upload */}

<div
onDragOver={(e)=>e.preventDefault()}
onDrop={handleDrop}
className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg mb-4"
>

<p className="text-gray-500">
Drag & Drop Image Here
</p>

<p className="text-gray-400 text-sm">
or click below
</p>

<input
type="file"
onChange={(e)=>setImage(e.target.files[0])}
className="mt-3"
/>

</div>


<button
onClick={extractText}
disabled={ocrLoading}
className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
>
Extract Text
</button>


{ocrLoading && (

<div className="mt-4 flex justify-center">

<Oval
height={40}
width={40}
color="#3b82f6"
secondaryColor="#93c5fd"
strokeWidth={4}
/>

</div>

)}



<textarea
rows="6"
value={text}
onChange={(e)=>setText(e.target.value)}
placeholder="Extracted text will appear here..."
className="w-full border rounded p-3 mt-6 text-black"
/>



<select
value={language}
onChange={(e)=>setLanguage(e.target.value)}
className="border p-2 rounded mt-4 w-full text-black"
>

<option value="en">English</option>
<option value="hi">Hindi</option>
<option value="es">Spanish</option>
<option value="fr">French</option>
<option value="ja">Japanese</option>

</select>



<button
onClick={convertSpeech}
disabled={speechLoading}
className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-4 w-full disabled:opacity-50"
>
Convert To Speech
</button>


{speechLoading && (

<div className="mt-4 flex justify-center">

<Oval
height={40}
width={40}
color="#22c55e"
secondaryColor="#86efac"
strokeWidth={4}
/>

</div>

)}



{audio && (

<div className="mt-6">

<audio controls className="w-full">
<source src={audio} type="audio/mp3"/>
</audio>

<a
href={audio}
download="speech.mp3"
className="block mt-4 text-blue-400 underline"
>
Download Audio
</a>

</div>

)}

</div>

</div>

  )
}

export default App