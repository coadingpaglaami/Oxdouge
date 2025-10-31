"use client";

import { useState, useEffect } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
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

import {
  useGetContactsQuery,
  useDeleteMessageMutation,
  useReplyMessageMutation,
} from "@/api/dashboard"; // your RTK Query hooks
import { ContactItem } from "@/interfaces/api/Contact";
import { toast } from "sonner";

export const Messages = () => {
  const [messages, setMessages] = useState<ContactItem[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactItem | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDeleteMessage, setSelectedDeleteMessage] =
    useState<ContactItem | null>(null);

  const { data, isLoading } = useGetContactsQuery({ page });
  const [deleteMessage] = useDeleteMessageMutation();
  const [replyMessage] = useReplyMessageMutation();

  // Update messages whenever API data changes
  useEffect(() => {
    if (data) {
      setMessages(data.results);
      const pages = Math.ceil(data.count / 10); // assuming 10 items per page
      setTotalPages(pages);
    }
  }, [data]);

  const totalNew = messages.filter((msg) => msg.status === "NEW").length;

  const statusStyles: Record<
    "NEW" | "REPLIED" | "READ",
    { bg: string; text: string }
  > = {
    NEW: { bg: "bg-[#FFD34533]", text: "text-[#FFD345]" },
    REPLIED: { bg: "bg-[#028C4F33]", text: "text-[#0DCF79]" },
    READ: { bg: "bg-[#3B80FF33]", text: "text-[#3B80FF]" },
  };

  const handleDeleteClick = (msg: ContactItem) => {
    setSelectedDeleteMessage(msg);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedDeleteMessage) {
      try {
        await deleteMessage(selectedDeleteMessage.id).unwrap();
        setMessages((prev) =>
          prev.filter((m) => m.id !== selectedDeleteMessage.id)
        );
        toast.success("Message deleted successfully");
      } catch (error) {
        console.error("Delete failed", error);
      }
    }
    setDeleteDialogOpen(false);
  };

  const handleSendReply = async (reply: string) => {
    if (!selectedMessage) return;
    try {
      await replyMessage({
        id: selectedMessage.id,
        admin_reply: reply,
      }).unwrap();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id ? { ...m, status: "REPLIED" } : m
        )
      );
      toast.success("Reply sent successfully");
      setSelectedMessage(null);
    } catch (error) {
      console.error("Reply failed", error);
    }
  };

  // Function to generate page numbers for pagination
  const getPaginationPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      // Show all pages if small
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // First 3 pages
      pages.push(1, 2, 3);

      // Middle pages around current page
      if (page > 4 && page < totalPages - 2) {
        pages.push("...");
        pages.push(page - 1, page, page + 1);
      } else if (page === 4) {
        pages.push(4);
      }

      // Ellipsis if needed before last pages
      if (page < totalPages - 3) pages.push("...");

      // Last 2 pages
      pages.push(totalPages - 1, totalPages);
    }

    return pages;
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
        <div className="flex items-center gap-2 text-white">
          <Mail className="w-5 h-5 text-primary" />
          <p className="text-base font-medium">Messages ({messages.length})</p>
        </div>

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
                  <TableCell className="text-white">{msg.name}</TableCell>
                  <TableCell className="text-white">{msg.email}</TableCell>
                  <TableCell className="text-white line-clamp-2 leading-snug">
                    {msg.message}
                  </TableCell>
                  <TableCell className="text-white">
                    {new Date(msg.created_at).toLocaleString()}
                  </TableCell>
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

          {/* Pagination */}
          <div className="flex justify-end gap-2 p-2 flex-wrap items-center">
            <Button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </Button>

            {getPaginationPages().map((p, idx) =>
              p === "..." ? (
                <span key={idx} className="px-2 text-gray-400">
                  ...
                </span>
              ) : (
                <Button
                  key={idx}
                  variant={page === p ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(Number(p))}
                >
                  {p}
                </Button>
              )
            )}

            <Button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
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
                  Message from {selectedMessage.name}
                </DialogTitle>
              </DialogHeader>

              <div className="flex flex-col gap-4 mt-4">
                <div className="grid grid-cols-2 gap-y-3">
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">From</label>
                    <span>{selectedMessage.name}</span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Date</label>
                    <span>
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm text-gray-400">Email</label>
                    <span>{selectedMessage.email}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Message</label>
                  <div className="bg-[#27272A] p-3 rounded-lg border border-primary/30 text-sm">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-400">Reply</label>
                  <Input
                    placeholder="Write your message here"
                    className="bg-[#27272A75] border-none text-white placeholder:text-gray-400"
                    id="replyInput"
                  />
                </div>

                <Button
                  className="self-center mt-2 w-1/3 "
                  variant="defaultGradient"
                  onClick={() => {
                    const input = (
                      document.getElementById("replyInput") as HTMLInputElement
                    )?.value;
                    handleSendReply(input);
                  }}
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
        <DialogContent className="sm:max-w-md text-left bg-[#121212] text-white border border-primary">
          <DialogHeader>
            <DialogTitle>
              Are You Want to Delete{" "}
              <span className="font-semibold">
                {selectedDeleteMessage?.name}
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


// "use client";

// import { useState, useEffect } from "react";
// import { Breadcrumb } from "@/appcomponent/reusable";
// import { MessageSquare, Trash2, Mail } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Input } from "@/components/ui/input";

// import {
//   useGetContactsQuery,
//   useDeleteMessageMutation,
//   useReplyMessageMutation,
// } from "@/api/dashboard"; // your RTK Query hooks
// import { ContactItem } from "@/interfaces/api/Contact";
// import { toast } from "sonner";

// export const Messages = () => {
//   const [messages, setMessages] = useState<ContactItem[]>([]);
//   const [selectedMessage, setSelectedMessage] = useState<ContactItem | null>(
//     null
//   );
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedDeleteMessage, setSelectedDeleteMessage] =
//     useState<ContactItem | null>(null);

//   const { data, isLoading } = useGetContactsQuery({page});
//   const [deleteMessage] = useDeleteMessageMutation();
//   const [replyMessage] = useReplyMessageMutation();

//   // Update messages whenever API data changes
//   useEffect(() => {
//     if (data) {
//       setMessages(data.results);
//       const pages = Math.ceil(data.count / 10); // assuming 10 items per page
//       setTotalPages(pages);
//     }
//   }, [data]);

//   const totalNew = messages.filter((msg) => msg.status === "NEW").length;

//   const statusStyles: Record<
//     "NEW" | "REPLIED" | "READ",
//     { bg: string; text: string }
//   > = {
//     NEW: { bg: "bg-[#FFD34533]", text: "text-[#FFD345]" },
//     REPLIED: { bg: "bg-[#028C4F33]", text: "text-[#0DCF79]" },
//     READ: { bg: "bg-[#3B80FF33]", text: "text-[#3B80FF]" },
//   };

//   const handleDeleteClick = (msg: ContactItem) => {
//     setSelectedDeleteMessage(msg);
//     setDeleteDialogOpen(true);
//   };

//   const handleConfirmDelete = async () => {
//     if (selectedDeleteMessage) {
//       try {
//         await deleteMessage(selectedDeleteMessage.id).unwrap();
//         setMessages((prev) =>
//           prev.filter((m) => m.id !== selectedDeleteMessage.id)
//         );
//         toast.success("Message deleted successfully");
//       } catch (error) {
//         console.error("Delete failed", error);
//       }
//     }
//     setDeleteDialogOpen(false);
//   };

//   const handleSendReply = async (reply: string) => {
//     if (!selectedMessage) return;
//     try {
//       await replyMessage({
//         id: selectedMessage.id,
//         admin_reply: reply,
//       }).unwrap();
//       setMessages((prev) =>
//         prev.map((m) =>
//           m.id === selectedMessage.id ? { ...m, status: "REPLIED" } : m
//         )
//       );
//       toast.success("Reply sent successfully");
//       setSelectedMessage(null);
//     } catch (error) {
//       console.error("Reply failed", error);
//     }
//   };

//   return (
//     <>
//       <Breadcrumb
//         title="Messages"
//         subtitle="View and respond to Customer Message"
//       />

//       {/* Header Summary */}
//       <div className="flex items-center gap-3 border border-primary bg-[#9A7B16A8] text-white px-4 py-3 rounded-md mt-4">
//         <Mail className="w-5 h-5 text-primary" />
//         <p className="text-sm">
//           You have{" "}
//           <span className="text-primary font-semibold">{totalNew}</span> New
//           Message
//         </p>
//       </div>

//       {/* Table Section */}
//       <div className="flex flex-col mt-6 gap-4">
//         <div className="flex items-center gap-2 text-white">
//           <Mail className="w-5 h-5 text-primary" />
//           <p className="text-base font-medium">Messages ({messages.length})</p>
//         </div>

//         <div className="rounded-md overflow-hidden border border-primary/20">
//           <Table>
//             <TableHeader className="bg-[#18181B]">
//               <TableRow>
//                 <TableHead className="text-white">Name</TableHead>
//                 <TableHead className="text-white">Email</TableHead>
//                 <TableHead className="text-white">Message</TableHead>
//                 <TableHead className="text-white">Date</TableHead>
//                 <TableHead className="text-white">Status</TableHead>
//                 <TableHead className="text-white">Action</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {messages.map((msg) => (
//                 <TableRow key={msg.id} className="border-b border-[#A6A6A6C4]">
//                   <TableCell className="text-white">{msg.name}</TableCell>
//                   <TableCell className="text-white">{msg.email}</TableCell>
//                   <TableCell className="text-white line-clamp-2 leading-snug">
//                     {msg.message}
//                   </TableCell>
//                   <TableCell className="text-white">
//                     {new Date(msg.created_at).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     <span
//                       className={`px-3 py-1 rounded-full text-sm font-medium ${
//                         statusStyles[msg.status].bg
//                       } ${statusStyles[msg.status].text}`}
//                     >
//                       {msg.status}
//                     </span>
//                   </TableCell>
//                   <TableCell className="flex gap-2">
//                     <Button
//                       variant="ghost"
//                       className="text-[#3B80FF] hover:bg-[#3B80FF33]"
//                       onClick={() => setSelectedMessage(msg)}
//                     >
//                       <MessageSquare className="w-4 h-4" />
//                     </Button>

//                     <Button
//                       variant="ghost"
//                       className="text-[#FF391F] hover:bg-[#FF391F33]"
//                       onClick={() => handleDeleteClick(msg)}
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {/* Pagination */}
//           <div className="flex justify-end gap-2 p-2">
//             <Button
//               disabled={page <= 1}
//               onClick={() => setPage((prev) => prev - 1)}
//             >
//               Previous
//             </Button>
//             <Button
//               disabled={page >= totalPages}
//               onClick={() => setPage((prev) => prev + 1)}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Reply Dialog */}
//       <Dialog
//         open={!!selectedMessage}
//         onOpenChange={() => setSelectedMessage(null)}
//       >
//         <DialogContent className="bg-[#121212] text-white border border-primary max-w-lg">
//           {selectedMessage && (
//             <>
//               <DialogHeader>
//                 <DialogTitle className="text-xl font-semibold">
//                   Message from {selectedMessage.name}
//                 </DialogTitle>
//               </DialogHeader>

//               <div className="flex flex-col gap-4 mt-4">
//                 <div className="grid grid-cols-2 gap-y-3">
//                   <div className="flex flex-col">
//                     <label className="text-sm text-gray-400">From</label>
//                     <span>{selectedMessage.name}</span>
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="text-sm text-gray-400">Date</label>
//                     <span>
//                       {new Date(selectedMessage.created_at).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex flex-col">
//                     <label className="text-sm text-gray-400">Email</label>
//                     <span>{selectedMessage.email}</span>
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <label className="text-sm text-gray-400">Message</label>
//                   <div className="bg-[#27272A] p-3 rounded-lg border border-primary/30 text-sm">
//                     {selectedMessage.message}
//                   </div>
//                 </div>

//                 <div className="flex flex-col gap-2">
//                   <label className="text-sm text-gray-400">Reply</label>
//                   <Input
//                     placeholder="Write your message here"
//                     className="bg-[#27272A75] border-none text-white placeholder:text-gray-400"
//                     id="replyInput"
//                   />
//                 </div>

//                 <Button
//                   className="self-center mt-2 w-1/3 "
//                   variant="defaultGradient"
//                   onClick={() => {
//                     const input = (
//                       document.getElementById("replyInput") as HTMLInputElement
//                     )?.value;
//                     handleSendReply(input);
//                   }}
//                 >
//                   Send
//                 </Button>
//               </div>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Delete Dialog */}
//       <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
//         <DialogContent className="sm:max-w-md text-left bg-[#121212] text-white border border-primary">
//           <DialogHeader>
//             <DialogTitle>
//               Are You Want to Delete{" "}
//               <span className="font-semibold">
//                 {selectedDeleteMessage?.name}
//                 {"'"}s
//               </span>{" "}
//               Messages?
//             </DialogTitle>
//           </DialogHeader>

//           <DialogFooter className="justify-start space-x-2">
//             <Button onClick={handleConfirmDelete}>Yes</Button>
//             <Button
//               variant="destructive"
//               onClick={() => setDeleteDialogOpen(false)}
//             >
//               No
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };
