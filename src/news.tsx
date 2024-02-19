import { useState } from "react";
import { Action, ActionPanel, List } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { Item } from "rss-parser";
import { getFeed } from "./feed";
import { Topic } from "./types";
import { formatTitle, getIcon, startCase } from "./utils";

export default function Command() {
  const [topic, setTopic] = useState<Topic | null>(null);
  const { data, isLoading, error } = usePromise(getFeed, [topic]);

  return (
    <List
      isLoading={isLoading}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Select Page"
          defaultValue={startCase(Topic.TheWorldThisWeek)}
          storeValue
          onChange={(newValue) => setTopic(newValue as Topic)}
        >
          {Object.entries(Topic).map(([name, value]) => (
            <List.Dropdown.Item key={value} title={startCase(name)} value={value} />
          ))}
        </List.Dropdown>
      }
    >
      {data?.map((item, index) => <FeedItem key={item.link} item={item} index={index} />)}
      {error && <List.Item title="Error" subtitle={error.message} />}
    </List>
  );
}

function FeedItem(props: { item: Item; index: number }) {
  const icon = getIcon(props.index + 1);
  const date = props.item.pubDate ? new Date(props.item.pubDate) : undefined;

  return (
    <List.Item
      icon={icon}
      title={formatTitle(props.item.title)}
      accessories={[{ date, tooltip: date?.toLocaleString() }]}
      actions={<Actions item={props.item} />}
    />
  );
}

function Actions(props: { item: Item }) {
  return (
    <ActionPanel title={props.item.title}>
      <ActionPanel.Section>
        {props.item.link && <Action.OpenInBrowser url={props.item.link} />}
        {props.item.link && (
          <Action.CopyToClipboard
            content={props.item.link}
            title="Copy Link"
            shortcut={{ modifiers: ["cmd"], key: "." }}
          />
        )}
      </ActionPanel.Section>
    </ActionPanel>
  );
}
