import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function Loader() {
  return (
    <Empty className="w-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner className="size-8 text-blue-500" />
        </EmptyMedia>
        <EmptyTitle className="font-bold text-blue-950">
          MyGigsAfrica
        </EmptyTitle>
        <EmptyDescription className="font-semibold">
          Processing.......
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
