"use client"

import React, { useState } from "react"

export default function TestPage() {
  const [count, setCount] = useState(0)

  return (
    <div className="p-6">
      <h1>Test Page</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  )
}
