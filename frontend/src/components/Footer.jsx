import { BorderMotif } from './Motifs.jsx'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__border">
        <BorderMotif color="var(--gold-500)" className="border-motif-stretch" />
      </div>
      <div className="container site-footer__inner">
        <p className="site-footer__name">HumSaath</p>
        <p className="site-footer__tagline">Jahan bhi ho, HumSaath</p>
        <p className="site-footer__copy">Bringing hearts closer, one celebration at a time.</p>
      </div>
    </footer>
  )
}
