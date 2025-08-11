import React, { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Card = forwardRef(({ 
  children, 
  gradient = false,
  hover = true,
  className = "",
  ...props 
}, ref) => {
  const baseStyles = gradient ? "card-gradient" : "card"
  
  return (
    <div
      ref={ref}
      className={cn(
        baseStyles,
        !hover && "hover:shadow-lg hover:-translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = "Card"

export default Card