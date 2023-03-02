"use client"
import Image from 'next/image'
import { Inter } from 'next/font/google'
import { useState, useCallback } from 'react';
import { SpinnerRoundFilled } from 'spinners-react';
import WriteLikeChatGPT from '@/components/WriteLikeChatGPT';
const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const [value, setValue] = useState('');
  const [prompt, setPrompt] = useState('');
  const [completion, setCompletion] = useState('');
  const [prevRequests, setPrevRequests] = useState([]);
  const [prevResponses, setPrevResponses] = useState([]);

  const handleKeyDown = useCallback(async (e) => {
    if (e.key === 'Enter') {
      setPrompt(value);
      setCompletion('Loading...');

      // Önceki istekleri dizide depolayın
      const combinedRequest = prevRequests.length > 0 ? prevRequests[prevRequests.length - 1] + '\n ' + value : value;
      setPrevRequests([...prevRequests, value]);

      // ChatGPT API'sına önceki istekleri ve yeni isteği gönderin
      const response = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: combinedRequest }),
      });
      const data = await response.json();

      // Önceki yanıtları dizide depolayın ve son yanıtı ayarlayın
      setPrevResponses([...prevResponses, data.data.choices[0].message.content]);
      setCompletion(data.data.choices[0].message.content);
      setValue('');
    }
  }, [prevRequests, prevResponses, value]);

  const handleStart = async () => {
    const response = await fetch('/api/gpt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: 'Start me!' }),
    });
    const data = await response.json();
    setCompletion(data.data.choices[0].message.content);
  }
  return (
    <main className='container mx-auto h-screen '>
      <div className="mt-48">
        <div className='container mx-auto w-1/2 text-center'>
          <h1 class="mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl ">Nutritionist&nbsp;<span class="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">AI</span> </h1>
          <p class="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400 mb-8">Nutritionist AI" is an AI-powered health app that provides personalized nutrition plans and offers recommendations for a healthy lifestyle</p>

        </div>
        <form onSubmit={(e) => { e.preventDefault() }}>
          <div class="flex align-center justify-center">
            <div class="relative w-1/2">
              <input type="search" id="search-dropdown" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-lg border-l-gray-100 border-l-2 border border-gray-300 focus:ring-cyan-500 focus:border-cyan-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search" required
                value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={handleKeyDown} />
              <button class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-cyan-800 rounded-r-lg border border-cyan-700 hover:bg-cyan-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"><svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg></button>
              <div className=' w-full flex flex-col align-center justify-center mt-6'>
                <div className='mb-3 font-light text-gray-500 dark:text-gray-400 flex justify-center flex-col align-center '>
                  {completion === 'Loading...' && <SpinnerRoundFilled />}
                  <p class="mb-3 font-light text-gray-500 dark:text-gray-400 ">{completion.split('\n').map((item) => <>  {<WriteLikeChatGPT message={item} />}<br /></>)}</p>
                </div>
              </div>
            </div>
          </div>
        </form>

      </div>
    </main >
  )
}
