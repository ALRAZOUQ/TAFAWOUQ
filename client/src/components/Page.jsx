import React from 'react'
//this component to have the same layout in each page
export default function Page({children}) {
  return (
    <div className='w-auto mx-auto container'>
      {children}
    </div>
  )
}
