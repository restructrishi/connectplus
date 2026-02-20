interface FileUploaderProps {
  opportunityId?: string;
  type?: string;
  onUploaded?: (key: string, url: string) => void;
}

export function FileUploader({ onUploaded }: FileUploaderProps) {
  const handleClick = () => {
    onUploaded?.("stub-key", "/api/pipeline/files/stub");
  };
  return (
    <button type="button" onClick={handleClick} className="text-sm px-2 py-1 border border-slate-300 rounded text-slate-700">
      Upload file
    </button>
  );
}
