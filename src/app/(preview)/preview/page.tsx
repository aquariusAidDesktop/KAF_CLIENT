import PreviewHeader from "@/features/(Preview)/PreviewHeader/ui/PreviewHeader";
import styles from "./page.module.css";
import PreviewStart from "@/features/(Preview)/PreviewStart/ui/PreviewStart";

const Main = () => {
  return (
    <>
      <PreviewHeader>
        <PreviewStart></PreviewStart>
      </PreviewHeader>
    </>
  );
};

export default Main;
