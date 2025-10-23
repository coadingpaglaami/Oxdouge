"use client";

import { useState } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
import { messages } from "@/data/messagesData";
import { MessageSquare, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Message } from "@/interfaces/Message";

export const Messages = () => {
  const [mmessages, setMessages] = useState(messages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  console.log(mmessages);

  // Separate state for delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteMessage, setSelectedDeleteMessage] =
    useState<Message | null>(null);

  const totalNew = messages.filter((msg) => msg.status === "New").length;

  const statusStyles: Record<string, { bg: string; text: string }> = {
    New: { bg: "bg-[#FFD34533]", text: "text-[#FFD345]" },
    Replied: { bg: "bg-[#028C4F33]", text: "text-[#0DCF79]" },
    Read: { bg: "bg-[#3B80FF33]", text: "text-[#3B80FF]" },
  };

  const handleDeleteClick = (msg: Message) => {
    setSelectedDeleteMessage(msg);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedDeleteMessage) {
      setMessages((prev) =>
        prev.filter((m) => m.id !== selectedDeleteMessage.id)
      );
    }
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <Breadcrumb
        title="Messages"
        subtitle="View and respond to Customer Message"
      />

      {/* Header Summary */}
      <div className="flex items-center gap-3 border border-primary bg-[#9A7B16A8] text-white px-4 py-3 rounded-md mt-4">
        <Mail className="w-5 h-5 text-primary" />
        <p className="text-sm">
          You have{" "}
          <span className="text-primary font-semibold">{totalNew}</span> New
          Message
        </p>
      </div>

      {/* Table Section */}
      <div className="flex flex-col mt-6 gap-4">
        {/* Header with Icon */}
        <div className="flex items-center gap-2 text-white">
          <Mail className="w-5 h-5 text-primary" />
          <p className="text-base font-medium">Messages ({messages.length})</p>
        </div>

        {/* Messages Table */}
        <div className="rounded-md overflow-hidden border border-primary/20">
          <Table>
            <TableHeader className="bg-[#18181B]">
              <TableRow>
                <TableHead className="text-white">Name</TableHead>
                <TableHead className="text-white">Email</TableHead>
                <TableHead className="text-white">Message</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messages.map((msg) => (
                <TableRow key={msg.id} className="border-b border-[#A6A6A6C4]">
                  <TableCell className="text-white">{msg.sender}</TableCell>
                  <TableCell className="text-white">{msg.email}</TableCell>
                  <TableCell className="text-white line-clamp-2 leading-snug">
                    {msg.message}
                  </TableCell>
                  <TableCell className="text-white">{msg.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[msg.status].bg
                      } ${statusStyles[msg.status].text}`}
                    >
                      {msg.status}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="text-[#3B80FF] hover:bg-[#3B80FF33]"
                      onClick={() => setSelectedMessage(msg)}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      className="text-[#FF391F] hover:bg-[#FF391F33]"
                      onClick={() => handleDeleteClick(msg)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="bg-[#121212] text-white border border-primary max-w-lg">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold">
                  Message from {selectedMessage.sender}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                {/* Info Section */}
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">From</label>
                    <span>{selectedMessage.sender}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Date</label>
                    <span>{selectedMessage.date}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Email</label>
                    <span>{selectedMessage.email}</span>
                  </div>
                </div>

                {/* Message Box */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Message</label>
                  <div className="bg-[#27272A] p-3 rounded-lg border border-primary/30 text-sm">
                    {selectedMessage.message}
                  </div>
                </div>

                {/* Reply Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Reply</label>
                  <Input
                    placeholder="Write your message here"
                    className="bg-[#27272A75] border-none text-white placeholder:text-gray-400"
                  />
                </div>

                {/* Send Button */}
                <Button
                  className="self-center mt-2 w-1/3 "
                  variant="defaultGradient"
                >
                  Send
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md text-left">
          <DialogHeader>
            <DialogTitle>
              Are You Want to Delete{" "}
              <span className="font-semibold">
                {selectedDeleteMessage?.sender}
                {"'"}s
              </span>{" "}
              Messages?
            </DialogTitle>
          </DialogHeader>

          <DialogFooter className="justify-start space-x-2">
            <Button onClick={handleConfirmDelete}>Yes</Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(false)}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
