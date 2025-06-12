"use client"

import { useEffect, type RefObject } from "react"

const useIntersectionObserver = (
  elementRefs: RefObject<HTMLElement | null>[],
  options: IntersectionObserverInit = { root: null, rootMargin: "0px", threshold: 0.1 },
) => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    }, options)

    elementRefs.forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current)
      }
    })

    return () => {
      elementRefs.forEach((ref) => {
        if (ref.current) {
          observer.unobserve(ref.current)
        }
      })
    }
  }, [elementRefs, options])
}

export default useIntersectionObserver
