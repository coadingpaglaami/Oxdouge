'use client';
import {
  useAddWhyChooseMutation,
  useDeleteWhyChooseMutation,
  useGetWhyChooseQuery,
  useUpdateWhyChooseMutation,
} from "@/api/ui_manager";

export const WhyChooseManagement = () => {
  const [addWhyChoose, { isLoading, error }] = useAddWhyChooseMutation();
  const {
    data,
    isLoading: isGetLoading,
    error: getError,
  } = useGetWhyChooseQuery();
  const [updateWhyChoose, { isLoading: isUpdateLoading, error: updateError }] =
    useUpdateWhyChooseMutation();
  const [deleteWhyChoose, { isLoading: isDeleteLoading, error: deleteError }] =
    useDeleteWhyChooseMutation();

  return <div></div>;
};
