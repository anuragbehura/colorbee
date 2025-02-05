import ColorPalletes from "@/components/ColorPalletes";
// import Image from "next/image";

export default function Home() {
  return (
    <div className="">
      <ColorPalletes colors={[]} likes={0} timeAgo={""} />
    </div>
  );
}
