"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
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
import { validatePartialRoomId, validateFullRoomId } from "@/lib/validators"

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
  className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] backdrop-blur-lg"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>
  <div className="w-full px-4">
    <motion.div
      className="flex flex-col items-center justify-center p-8 rounded-3xl bg-white/5 border border-white/20 shadow-2xl max-w-md mx-auto space-y-6 backdrop-blur-xl"
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <motion.h2 className="text-xl font-bold tracking-tight text-white">
        🔐 Join a Room
      </motion.h2>

      <motion.p className="text-sm text-neutral-300 text-center">
        Enter your 6-digit code or create a new one
      </motion.p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="roomId"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
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
                    className="gap-3"
                  >
                    <InputOTPGroup className="gap-3 flex justify-center items-center w-full">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="
                            w-12 h-14
                            text-xl text-white font-mono text-center
                            bg-white/10 backdrop-blur-md
                            border border-white/20
                            rounded-xl shadow-inner
                            transition-all duration-200
                            focus-within:outline-none
                            focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2
                            hover:border-white/30
                          "
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>

                </FormControl>
                <FormMessage className="text-xs text-red-400 text-center mt-2" />
              </FormItem>
            )}
          />

          <div className="text-sm text-neutral-300 text-center">
            You&apos;ll join as{" "}
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={username}
                className="text-indigo-400 font-medium"
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.2 }}
              >
                {username}
              </motion.span>
            </AnimatePresence>
            <Button
              type="button"
              onClick={handleRegenerateName}
              variant="ghost"
              className="text-xs text-neutral-400 hover:text-white ml-2 px-2 h-6"
              disabled={isJoining || isCreating}
            >
              Regenerate
            </Button>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full rounded-full text-sm h-10 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
              disabled={isJoining || isCreating}
            >
              <LogIn size={16} className="mr-2" />
              {isJoining ? "Joining..." : "Join Room"}
            </Button>

            <Button
              type="button"
              onClick={handleCreateRoom}
              className="w-full rounded-full text-sm h-10 bg-white/10 text-white hover:bg-white/20 border border-white/30"
              disabled={isJoining || isCreating}
            >
              <PlusCircle size={16} className="mr-2" />
              {isCreating ? "Creating..." : "Create New Room"}
            </Button>
          </div>
        </form>
      </Form>

      <motion.p className="text-neutral-400 mt-4 text-xs text-center">
        Best experience on speakers or headphones.
      </motion.p>
    </motion.div>
  </div>
</motion.div>

  )
}
