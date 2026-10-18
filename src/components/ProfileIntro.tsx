import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

const social = [
  { label: 'GitHub', url: 'https://github.com/zhanghan-13', image: 'github.svg' },
  { label: 'Bilibili', url: 'https://space.bilibili.com/501122856', image: 'bilibili.svg' },
  { label: '邮箱', url: 'mailto:han892577@qq.com', image: 'mail.svg' },
]

export default function ProfileIntro({ headingLevel = 1 }: { headingLevel?: 1 | 2 }) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2'
  return <TooltipProvider delayDuration={220}><section className="introduction">
    <div className="profile-copy"><Heading className="profile-name">张晗</Heading><p className="intro-summary">软件工程师、学习者</p>
      <div className="social-links">{social.map(({ label, url, image }) => <Tooltip key={label} disableHoverableContent>
        <TooltipTrigger asChild><Button variant="social" size="icon-touch" asChild><a href={url} aria-label={label} target={label === '邮箱' ? undefined : '_blank'} rel="noopener noreferrer"><img className={cn('social-brand', label !== 'Bilibili' && 'social-neutral')} src={'/social/' + image} width="40" height="40" alt="" aria-hidden="true" /></a></Button></TooltipTrigger><TooltipContent sideOffset={6}>{label}</TooltipContent>
      </Tooltip>)}</div>
    </div>
    <a className="profile-avatar-link" href="https://github.com/zhanghan-13" target="_blank" rel="noopener noreferrer" aria-label="张晗的 GitHub 主页"><Avatar className="profile-avatar"><AvatarImage src="/github-avatar.png" alt="张晗的 GitHub 头像" /><AvatarFallback>ZH</AvatarFallback></Avatar></a>
  </section></TooltipProvider>
}
