'use client'

import { JSX, useEffect, useState } from 'react'
import { MdClose } from 'react-icons/md'
import { usePathname } from 'next/navigation'

// Local Imports
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { GroceryHeader, GroceryHeaderMin } from '@/components/page-specific/grocery/GroceryHeaders'
import { ScrollArea } from '@/components/ui/scroll-area'
import GroceryList from '@/app/(data-hydrate)/grocery-list/groceryList'
import Spinner from '../Spinner'

interface SideListProps {
  isUser: boolean
  loading?: boolean
  className?: string
  additionalBackButtonClick?: () => void
}

export default function SideList({ isUser, loading, className, additionalBackButtonClick }: SideListProps): JSX.Element {
  const pathname = usePathname()
  const [savedPage, setSavedPage] = useState(false)

  useEffect(() => {
    const advancedHeader = !(pathname.includes('saved') || pathname.includes('social'));
    setSavedPage(advancedHeader);
  }, [pathname])

  const handleBackButtonClick = () => {
    additionalBackButtonClick?.()
  }

  return (
    <div className={`w-full h-full pl-0 md:pl-4 lg:pl-6 xl:pl-6 ${className}`}>
      <Card className='h-full flex flex-col bg-card-background rounded-lg'>
        <CardHeader className='bg-primary text-[#202020] text-center rounded-lg'>
          {savedPage ? <GroceryHeaderMin width='100%' /> : <GroceryHeader additionalBackClick={handleBackButtonClick} />}
        </CardHeader>

        <CardContent className='flex-1 bg-background overflow-y-auto relative'>
          {loading ? (
            <Spinner />
          ) : (
            <>
              <ScrollArea>
                <GroceryList
                  isUser={isUser}
                  renderContent={false}
                  className='mt-4 bg-card-background'
                />
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
