import { Badge } from "~/components/ui/badge";
import { X } from "lucide-react";
import { useState } from "react";

export interface TagNoID {
  name: string;
  color: string;
}

interface Props {
  tags: TagNoID[];
  setTags: (tags: TagNoID[]) => void;
}

export default function TagSelect({ tags, setTags }: Props) {
  const [tagName, setTagName] = useState("");
  const [tagColor, setTagColor] = useState("");

  const handleAddTag = () => {
    if (tagName.trim() !== "" && tagColor.trim() !== "") {
      const newTag: TagNoID = {
        name: tagName.trim(),
        color: tagColor.trim(),
      };
      setTags([...tags, newTag]);
      setTagName("");
      setTagColor("");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row flex-wrap gap-3">
        {tags
          ? tags.map((tag, i) => (
              <Badge key={i} className="max-h-8">
                {tag.name}
                <X
                  className="h-5 w-5 pl-1 hover:cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTags(tags.filter((t) => t !== tag));
                  }}
                />
              </Badge>
            ))
          : null}
      </div>
      <div>
        <input
          type="text"
          placeholder="Tag Name"
          value={tagName}
          onChange={(e) => setTagName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tag Color"
          value={tagColor}
          onChange={(e) => setTagColor(e.target.value)}
        />
        <button onClick={handleAddTag}>Add Tag</button>
      </div>
    </div>
  );
}
