"use client";

import { useEffect, useRef, useState } from "react";

const sections = ["inicio", "sobre", "experiencia", "projetos", "servicos", "contato"];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState(0);
  const [service, setService] = useState(0);
  const projectTrackRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ active: false, x: 0, scrollLeft: 0 });
  const snapLock = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(sections.indexOf(entry.target.id));
      }),
      { threshold: 0.45 },
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const animateTo = (targetIndex: number) => {
      const target = document.getElementById(sections[targetIndex]);
      if (!target || snapLock.current) return;

      snapLock.current = true;
      const start = window.scrollY;
      const destination = target.offsetTop;
      const distance = destination - start;
      const duration = 820;
      const startedAt = performance.now();

      const frame = (now: number) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 5);
        window.scrollTo(0, start + distance * eased);
        if (progress < 1) requestAnimationFrame(frame);
        else window.setTimeout(() => { snapLock.current = false; }, 120);
      };

      requestAnimationFrame(frame);
    };

    const onWheel = (event: WheelEvent) => {
      if (window.innerWidth <= 900 || Math.abs(event.deltaY) < 18) return;
      if ((event.target as HTMLElement).closest(".project-track")) return;
      event.preventDefault();
      if (snapLock.current) return;
      animateTo(Math.max(0, Math.min(sections.length - 1, active + (event.deltaY > 0 ? 1 : -1))));
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (window.innerWidth <= 900 || snapLock.current) return;
      if (!["ArrowDown", "ArrowUp", "PageDown", "PageUp"].includes(event.key)) return;
      event.preventDefault();
      const forward = event.key === "ArrowDown" || event.key === "PageDown";
      animateTo(Math.max(0, Math.min(sections.length - 1, active + (forward ? 1 : -1))));
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [active]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <header className="site-header">
        <button className="burger" onClick={() => setMenuOpen(true)} aria-label="Abrir menu"><span /><span /></button>
        <a className="monogram" href="#inicio">VN</a>
        <nav className="quick-links"><a href="#projetos">Projetos</a><a href="#contato">Contato</a></nav>
      </header>

      <aside className={`drawer ${menuOpen ? "open" : ""}`} aria-hidden={!menuOpen}>
        <button className="drawer-close" onClick={closeMenu} aria-label="Fechar menu" />
        <div className="drawer-mark">VN</div>
        <nav>
          {sections.map((item, index) => (
            <a key={item} className={active === index ? "current" : ""} href={`#${item}`} onClick={closeMenu}>{item}</a>
          ))}
        </nav>
      </aside>
      {menuOpen && <button className="backdrop" onClick={closeMenu} aria-label="Fechar menu" />}

      <div className="progress" aria-hidden="true"><span style={{ width: `${((active + 1) / sections.length) * 100}%` }} /><b>{active + 1}/{sections.length}</b></div>

      <section id="inicio" className="hero panel">
        <div className="hero-art">
          <img
            className="hero-portrait"
            src="/foto-victor-nadoti.png"
            alt="Victor Nadoti, desenvolvedor Front-End"
          />
        </div>
        <div className="hero-copy reveal">
          <p className="eyebrow">Olá, eu sou</p>
          <h1>Victor<br />Nadoti</h1>
          <p className="hero-intro">Desenvolvedor Front-End especialista em criar sites e landing pages que unem design, velocidade e conversão.</p>
          <a className="round-arrow" href="#contato" aria-label="Ir para contato">↘</a>
        </div>
        <div className="ticker"><div>DESENVOLVEDOR DIGITAL // LANDING PAGES // EXPERIÊNCIAS DIGITAIS // DESENVOLVEDOR SITES // LANDING PAGES // EXPERIÊNCIAS DIGITAIS //</div></div>
      </section>

      <section id="sobre" className="panel content-panel">
        <p className="section-label">minha jornada criativa</p>
        <div className="about-grid">
          <h2>Transformo ideias em experiências digitais claras, marcantes e prontas para gerar resultado.</h2>
          <figure className="about-portrait">
            <img src="/foto-victor-nadoti-perfil.png" alt="Victor Nadoti em um ambiente com projeção de código" />
            <figcaption><span>DESIGN</span><b>+</b><span>CÓDIGO</span></figcaption>
          </figure>
          <div className="stat"><strong>100%</strong><span>foco em cada projeto</span></div>
          <p>Meu trabalho combina interface, desenvolvimento responsivo e atenção aos detalhes. Cada página nasce com uma estratégia: apresentar sua marca, facilitar a navegação e conduzir o visitante até a ação certa.</p>
          <div className="stat"><strong>01</strong><span>parceiro do início ao lançamento</span></div>
          <p>Construo soluções autorais para profissionais e empresas que querem se destacar — do primeiro conceito à versão final publicada.</p>
        </div>
      </section>

      <section id="experiencia" className="panel content-panel">
        <p className="section-label">experiência</p>
        <div className="experience-grid">
          <div><p className="muted">Estratégia, UI e desenvolvimento reunidos em um processo direto, colaborativo e orientado a resultados.</p><a className="outline-button" href="#contato">Solicitar apresentação <span>↗</span></a></div>
          <div className="experience-list">
            {[['Desenvolvedor Front-End','Sites responsivos'],['Especialista em Landing Pages','Conversão e performance'],['UI para Web','Design e interação'],['Parceiro Digital','Do briefing ao lançamento']].map((job, index) => (
              <article key={job[0]}><span>0{index + 1}</span><div><h3>{job[0]}</h3><p>{job[1]}</p></div><b>↗</b></article>
            ))}
          </div>
        </div>
      </section>

      <section id="projetos" className="panel content-panel projects-panel">
        <p className="section-label">projetos selecionados</p>
        <div
          className="project-track"
          ref={projectTrackRef}
          tabIndex={0}
          role="region"
          aria-label="Projetos selecionados. Arraste ou use as setas para navegar."
          onWheel={(event) => {
            const track = projectTrackRef.current;
            if (!track || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
            event.preventDefault();
            track.scrollLeft += event.deltaY;
          }}
          onKeyDown={(event) => {
            const track = projectTrackRef.current;
            if (!track || !["ArrowLeft", "ArrowRight"].includes(event.key)) return;
            event.preventDefault();
            track.scrollBy({ left: event.key === "ArrowRight" ? 360 : -360, behavior: "smooth" });
          }}
          onPointerDown={(event) => {
            if (event.pointerType === "touch") return;
            const track = projectTrackRef.current;
            if (!track) return;
            dragState.current = { active: true, x: event.clientX, scrollLeft: track.scrollLeft };
            track.setPointerCapture(event.pointerId);
            track.classList.add("is-dragging");
          }}
          onPointerMove={(event) => {
            const track = projectTrackRef.current;
            if (!track || !dragState.current.active) return;
            track.scrollLeft = dragState.current.scrollLeft - (event.clientX - dragState.current.x);
          }}
          onPointerUp={(event) => {
            const track = projectTrackRef.current;
            if (!track) return;
            dragState.current.active = false;
            if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
            track.classList.remove("is-dragging");
          }}
          onPointerCancel={() => {
            dragState.current.active = false;
            projectTrackRef.current?.classList.remove("is-dragging");
          }}
        >
          {[
            { title: 'Old School Coquetelaria', type: 'Landing Page Premium', image: '/projeto-old-school-coquetelaria.png' },
            { title: 'Portfólio autoral', type: 'UI + Desenvolvimento' },
            { title: 'Site de negócio', type: 'Design + Performance' }
          ].map((project, index) => (
            <article className={`project-card project-${index + 1}`} key={project.title}>
              <div className="project-visual">
                {project.image ? <img src={project.image} alt="Página inicial do projeto Old School Coquetelaria" /> : <i />}
                <span>0{index + 1}</span>
              </div>
              <p>{project.type}</p>
              <h3>{project.title}</h3>
            </article>
          ))}
        </div>
        <p className="drag-note">Arraste horizontalmente para explorar →</p>
      </section>

      <section id="servicos" className="panel content-panel services-panel">
        <p className="section-label">como posso ajudar</p>
        <div className="services-grid">
          <div className="service-list">
            {['Landing Pages','Sites Institucionais','Portfólios','Front-End sob medida'].map((item, index) => (
              <button className={service === index ? "active" : ""} onClick={() => setService(index)} key={item}><span>0{index + 1}</span>{item}</button>
            ))}
          </div>
          <div className="service-detail"><div className={`service-shape shape-${service}`}><span>VN</span></div><p>{[
            'Páginas focadas em apresentar sua oferta com clareza e transformar visitas em contatos.',
            'Presença digital completa, responsiva e alinhada à personalidade da sua marca.',
            'Uma vitrine autoral para mostrar sua trajetória, seus projetos e seu diferencial.',
            'Interfaces modernas desenvolvidas com código limpo, desempenho e atenção aos detalhes.'
          ][service]}</p></div>
        </div>
      </section>

      <section id="contato" className="panel content-panel contact-panel">
        <p className="section-label">vamos criar juntos</p>
        <div className="contact-grid">
          <div><h2>Tem um projeto<br />em mente?</h2><p>Conte sua ideia e vamos transformar isso em uma presença digital que chama atenção e gera resultado.</p><a className="contact-orbit" href="https://wa.me/5517996511914?text=Ol%C3%A1%20%2C%20vim%20do%20seu%20site%20gostaria%20de%20um%20or%C3%A7amento%20para%20um%20Site."><span>FALAR COMIGO ↗</span></a></div>
          <div className="contact-info"><p>Contato</p><a href="mailto:vnadoti@gmail.com">vnadoti@gmail.com</a><p>Social</p><a href="https://wa.me/5517996511914?text=Ol%C3%A1%20%2C%20vim%20do%20seu%20site%20gostaria%20de%20um%20or%C3%A7amento%20para%20um%20Site.">WhatsApp</a><a href="https://www.instagram.com/vnadoti/">Instagram</a></div>
        </div>
        <footer><span>© 2026 Victor Nadoti</span><span>Desenvolvido com intenção.</span></footer>
      </section>
    </main>
  );
}
