import { Heart, Loader } from "react-feather"

type Props = {
  isFollowed: boolean
  onClick?: () => void
  isLoading?: boolean
}

export default function FollowButton({
  isFollowed,
  onClick,
  isLoading = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="group rounded-full bg-slate-200 bg-opacity-5 border border-slate-400 h-8 w-8 flex items-center justify-center"
    >
      {isLoading ? (
        <Loader className="w-4 h-4 stroke-red-500 animate-spin" />
      ) : isFollowed ? (
        <Heart className="w-4 h-4 stroke-red-500 fill-red-400" />
      ) : (
        <Heart className="w-4 h-4 stroke-red-500 group-hover:fill-red-400 transition-all" />
      )}
    </button>
  )
}
