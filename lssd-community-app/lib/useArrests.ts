'use client'
import { useEffect, useState } from 'react'

export type Entry = Record<string, any>

export function useArrests() {
  const [data, setData] = useState<Entry[]>([])
  useEffect(() => {
    fetch('https://sheetdb.io/api/v1/o1tr55vq0v5qp')
      .then(res => res.json())
      .then(setData)
  }, [])
  return data
}
