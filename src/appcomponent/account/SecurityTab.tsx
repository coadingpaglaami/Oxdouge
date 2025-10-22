import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const SecurityTab = () => {
  return (
    <div className="flex flex-col gap-6 p-6 border border-primary rounded-lg">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-white">Update Password</h2>
        <p className="text-sm text-gray-400">
          Update your password to keep your account secure.
        </p>
      </div>

      {/* Form Section */}
      <form className="flex flex-col gap-4 w-full ">
        <label className="text-sm text-gray-300">Current Password</label>
        <Input
          type="password"
          placeholder="Current Password"
          className="w-full border border-primary/20"
        />
        <label className="text-sm text-gray-300">New Password</label>
        <Input
          type="password"
          placeholder="New Password"
          className="w-full border-primary/20"
        />
        <label className="text-sm text-gray-300">Confirm New Password</label>
        <Input
          type="password"
          placeholder="Confirm New Password"
          className="w-full border border-primary/20"
        />

        <Button
          variant="default"
          className="mt-2 w-fit  bg-primary hover:bg-primary/90"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
};


