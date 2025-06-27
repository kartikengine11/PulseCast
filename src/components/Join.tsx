"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { LogIn, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

import { generateName } from "@/lib/randomNames"
import { useRoomStore } from "@/store/room"
import {validatePartialRoomId,validateFullRoomId} from '../lib/validators'

const formSchema = z.object({
  roomId: z.string().length(6, {
    message: "Room code must be 6 digits.",
  }),
})

export const Join = () => {
  const [isJoining, setIsJoining] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const setUsername = useRoomStore((state) => state.setUsername)
  const username = useRoomStore((state) => state.username)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomId: "",
    },
  })

  useEffect(() => {
    const generatedName = generateName()
    setUsername(generatedName)
  }, [setUsername])

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setIsJoining(true)

    if (!validateFullRoomId(data.roomId)) {
      toast.error("Invalid room code. Please enter 6 digits.")
      setIsJoining(false)
      return
    }

    router.push(`/room/${data.roomId}`)
  }

  const handleCreateRoom = () => {
    setIsCreating(true)
    const newRoomId = Math.floor(100000 + Math.random() * 900000).toString()
    router.push(`/room/${newRoomId}`)
  }

  const handleRegenerateName = () => {
    const newName = generateName()
    setUsername(newName)
  }

  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-neutral-950 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full px-1">
        <motion.div
          className="flex flex-col items-center justify-center p-6 bg-neutral-900 rounded-lg border border-neutral-800 shadow-xl max-w-[28rem] mx-auto"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h2 className="text-base font-medium tracking-tight mb-1 text-white">
            Join a Beatsync Room
          </motion.h2>

          <motion.p className="text-neutral-400 mb-5 text-center text-xs">
            Enter a room code to join or create a new room
          </motion.p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <FormField
                control={form.control}
                name="roomId"
                render={({ field }) => (
                  <FormItem className="flex justify-center">
                    <FormControl>
                      <InputOTP
                        autoFocus
                        maxLength={6}
                        inputMode="numeric"
                        value={field.value}
                        onChange={(value) => {
                          if (validatePartialRoomId(value)) {
                            field.onChange(value)
                          }
                        }}
                        className="gap-2"
                      >
                        <InputOTPGroup className="gap-2">
                          {Array.from({ length: 6 }).map((_, index) => (
                            <InputOTPSlot
                              key={index}
                              index={index}
                              className="w-9 h-10 text-base bg-neutral-800/80 border-neutral-700 focus-within:ring-1 focus-within:ring-primary/30"
                            />
                          ))}
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage className="text-xs text-red-500 text-center mt-1" />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-center mt-5">
                <div className="text-sm text-neutral-400">
                  You&apos;ll join as{" "}
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={username}
                      className="text-primary font-medium inline-block"
                      initial={{ opacity: 0, filter: "blur(8px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, filter: "blur(8px)" }}
                      transition={{ duration: 0.2 }}
                    >
                      {username}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <Button
                  type="button"
                  onClick={handleRegenerateName}
                  variant="ghost"
                  className="text-xs text-neutral-500 hover:text-neutral-300 ml-2 h-6 px-2"
                  disabled={isJoining || isCreating}
                >
                  Regenerate
                </Button>
              </div>

              <div className="flex flex-col gap-3 mt-5">
                <Button
                  type="submit"
                  className="w-full rounded-full text-sm flex items-center justify-center"
                  disabled={isJoining || isCreating}
                >
                  <LogIn size={16} className="mr-2" />
                    {isJoining ? "Joining..." : "Join room"}
                </Button>

                <Button
                  type="button"
                  onClick={handleCreateRoom}
                  className="w-full rounded-full text-sm flex items-center justify-center"
                  variant="secondary"
                  disabled={isJoining || isCreating}
                >
                  <PlusCircle size={16} className="mr-2" />
                  {isCreating ? "Creating..." : "Create new room"}
                </Button>
              </div>
            </form>
          </Form>

          <motion.p className="text-neutral-500 mt-5 text-center text-xs leading-relaxed">
            Use native device speakers.
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}
