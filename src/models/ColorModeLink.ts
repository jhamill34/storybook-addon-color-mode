import React from 'react'

export interface ColorModeLink {
  id: string
  title: string
  right?: React.ReactNode
  onClick?: () => void
}
