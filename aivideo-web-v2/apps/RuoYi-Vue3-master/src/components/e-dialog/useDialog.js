/*
 * @Author: Hewei
 * @Date: 2023-12-12
 * @Description: useDialog hook
 * @LastEditors: Hewei
 * @LastEditTime: 2023-12-13 09:40:45
 */
export const useDialog = (configs) => {
    const open = ref(false);
    const dialogLoading = ref(false);
    const title = ref(configs?.title || '弹窗标题');
    const handleOpen = () => {
        open.value = true;
    };
    const handleDialogClose = () => {
        open.value = false;
        configs?.onClose && configs?.onClose();
    };
    const openLoading = () => {
        dialogLoading.value = true;
    };
    const closeLoading = () => {
        dialogLoading.value = false;
    };
    const handleDialogSubmit = () => {
        configs?.onSubmit && configs?.onSubmit();
    };

    return {
        dialogLoading,
        open,
        title,
        handleOpen,
        handleDialogClose,
        openLoading,
        closeLoading,
        handleDialogSubmit,
    };
};
