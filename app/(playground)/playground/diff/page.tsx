import combined from "./combined.json";
import combinedAI from "./combined-ai.json";
import { DiffEditor } from "./diff-editor";

const file1Lines = JSON.stringify(combined, null, 2).split("\n");
const file2Lines = JSON.stringify(combinedAI, null, 2).split("\n");


export default function Page() {  
  return <DiffEditor file1Lines={file1Lines} file2Lines={file2Lines} />
}