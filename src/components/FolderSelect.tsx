import { open } from "@tauri-apps/plugin-dialog";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";
import { useStore } from "@/lib/stores";

export default function FolderSelect() {
  const { t } = useTranslation();
  const setSelectedFolder = useStore((state) => state.setSelectedFolder);

  // 打开文件夹选择对话框
  async function selectFolder() {
    try {
      const selectedPath = await open({
        directory: true, // 设置为 true 表示选择文件夹而非文件
        multiple: false, // 是否允许多选，默认为 false
      });

      if (selectedPath) {
        console.log("用户选择的文件夹路径:", selectedPath);
        setSelectedFolder(selectedPath);
      } else {
        console.log("用户取消了选择");
      }
    } catch (error) {
      console.error("选择文件夹时出错:", error);
    }
  }
  return (
    <div>
      <Button className="bg-blue-300 hover:bg-blue-700" onClick={selectFolder}>
        {t("selectFolder")}
      </Button>
    </div>
  );
}
