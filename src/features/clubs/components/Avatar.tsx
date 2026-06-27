import { coverGradient, initials } from './visuals'

type AvatarProps = {
  name: string
  avatarUrl?: string | null
  size?: number
}

export function Avatar({ name, avatarUrl, size = 32 }: AvatarProps) {
  return (
    <div
      className="grid shrink-0 place-items-center overflow-hidden rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        background: coverGradient(name),
        fontSize: Math.round(size * 0.4),
      }}
      title={name}
    >
      {avatarUrl ? (
        <img src={avatarUrl} alt="" className="size-full object-cover" />
      ) : (
        initials(name)
      )}
    </div>
  )
}
