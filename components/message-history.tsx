"use client"

import { useState } from "react"
import { CalendarIcon, Filter, Loader2 } from "lucide-react"
import { format, subDays } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  created_at: string
  type?: string
}

interface MessageHistoryProps {
  messages: Message[]
  isLoading: boolean
  hasMore: boolean
  onLoadMore: () => void
}

export function MessageHistory({ messages, isLoading, hasMore, onLoadMore }: MessageHistoryProps) {
  // Initialize with yesterday's date
  const [date, setDate] = useState<Date>(subDays(new Date(), 1))
  const [type, setType] = useState<string>("all")

  // Filter messages based on selected date and type
  const filteredMessages = messages.filter((message) => {
    let matchesDate = true
    let matchesType = true

    if (date) {
      const messageDate = new Date(message.created_at)
      matchesDate =
        messageDate.getDate() === date.getDate() &&
        messageDate.getMonth() === date.getMonth() &&
        messageDate.getFullYear() === date.getFullYear()
    }

    if (type !== "all") {
      matchesType = message.type === type
    }

    return matchesDate && matchesType
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full sm:w-[240px] justify-start text-left font-normal",
                !date && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => setDate(newDate || subDays(new Date(), 1))}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="note">Notes</SelectItem>
            <SelectItem value="task">Tasks</SelectItem>
            <SelectItem value="idea">Ideas</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          className="w-full sm:w-auto"
          onClick={() => {
            setDate(subDays(new Date(), 1)) // Reset to yesterday
            setType("all")
          }}
        >
          Reset Filters
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredMessages.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center h-32 text-muted-foreground">
              No messages found for the selected filters.
            </CardContent>
          </Card>
        ) : (
          <>
            {filteredMessages.map((message) => (
              <Card key={message.id} className="group hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{format(new Date(message.created_at), "MMM d, yyyy h:mm a")}</Badge>
                        {message.type && (
                          <Badge
                            className={cn(
                              message.type === "note" && "bg-blue-500",
                              message.type === "task" && "bg-green-500",
                              message.type === "idea" && "bg-purple-500",
                            )}
                          >
                            {message.type}
                          </Badge>
                        )}
                      </div>
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {hasMore && (
              <Button variant="outline" className="w-full" onClick={onLoadMore} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More Messages"
                )}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

