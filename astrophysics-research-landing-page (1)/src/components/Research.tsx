import type { ReactNode } from 'react';
import { mailTo, pipelineStages, projects, researchNote, ztfSpecs, type Project } from '../data/content';
import { cn } from '../utils/cn';
import { HawkingModel } from './HawkingModel';
import { MotionModel } from './MotionModel';
import { Section } from './Section';
import { Arrow, PanelHead, Readout, StateMark } from './ui';

export function Research() {
  const [observational, theoretical] = projects;
  const activeCount = projects.filter((project) => project.status.state === 'active').length;

  return (
    <Section
      id="research"
      index="02"
      label="Research Projects"
      labelFa="پژوهش‌ها"
      title="Two research lines: one observational, one theoretical."
      meta={[
        { k: 'Lines', v: String(projects.length) },
        { k: 'Active', v: String(activeCount) },
        { k: 'In prep.', v: String(projects.length - activeCount) },
      ]}
    >
      <p className="flex flex-col gap-1.5 border border-line bg-hull px-4 py-3.5 text-[15px] leading-relaxed text-body sm:flex-row sm:gap-4">
        <span className="label shrink-0 pt-1 text-signal">Note</span>
        <span>{researchNote}</span>
      </p>

      <ProjectPanel
        project={observational}
        instrument={
          <>
            <MotionModel />
            <SourceSpecs />
          </>
        }
      >
        <PipelineTable />
      </ProjectPanel>

      <ProjectPanel project={theoretical} instrument={<HawkingModel />} />
    </Section>
  );
}

interface ProjectPanelProps {
  project: Project;
  instrument: ReactNode;
  children?: ReactNode;
}

function ProjectPanel({ project, instrument, children }: ProjectPanelProps) {
  const titleId = `${project.id}-title`;
  const active = project.status.state === 'active';

  return (
    <article id={project.id} aria-labelledby={titleId} className="panel mt-6 scroll-mt-20">
      {/* Unreviewed work carries a hazard band, the way unverified hardware is tagged. */}
      {!active && <div aria-hidden="true" className="hazard h-1.5" />}

      <header className="flex flex-col gap-1.5 border-b border-line px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5">
        <p className="label">
          <span className="text-bright">{project.code}</span> · {project.field}
        </p>
        <p className={cn('label flex flex-wrap items-center gap-x-2 gap-y-0.5', active ? 'text-nominal' : 'text-signal')}>
          <StateMark tone={active ? 'nominal' : 'signal'} />
          {project.status.label}
          <span className="text-dim">{project.status.detail}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(0,27rem)]">
        {/* On wide, tall screens the description stays pinned while the longer instrument column scrolls past. */}
        <div className="min-w-0 p-4 sm:p-6 xl:top-14 xl:self-start xl:[@media(min-height:860px)]:sticky">
          <h3 id={titleId} className="display text-[1.75rem] font-medium leading-tight tracking-[-0.015em] text-bright">
            {project.name}
          </h3>
          <p className="mt-4 max-w-[62ch] leading-[1.65] text-body">{project.summary}</p>

          <dl className="mt-6 border-b border-line">
            {project.facts.map((fact) => (
              <div key={fact.k} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-3 border-t border-line py-2.5">
                <dt className="label pt-0.5">{fact.k}</dt>
                <dd className="text-[15px] leading-snug text-bright">{fact.v}</dd>
              </div>
            ))}
          </dl>

          {children}

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-[44ch] text-sm leading-relaxed text-mute">{project.openTo}</p>
            <a href={mailTo(project.mailSubject)} className="btn btn-secondary shrink-0">
              Discuss this project
              <Arrow direction="out" />
            </a>
          </div>
        </div>

        <div className="min-w-0 border-t border-line xl:border-l xl:border-t-0">{instrument}</div>
      </div>
    </article>
  );
}

/** The pipeline as a stage table: what each step does and what it hands on. */
function PipelineTable() {
  return (
    <table className="mt-6 w-full border-collapse text-left">
      <caption className="label pb-2 text-left">Pipeline stages</caption>
      <thead>
        <tr className="border-y border-line bg-deck">
          <th scope="col" className="label w-12 px-2.5 py-2 font-normal">
            ID
          </th>
          <th scope="col" className="label px-2.5 py-2 font-normal">
            Operation
          </th>
          <th scope="col" className="label px-2.5 py-2 font-normal">
            Product
          </th>
        </tr>
      </thead>
      <tbody>
        {pipelineStages.map((stage) => (
          <tr key={stage.id} className="border-b border-line">
            <td className="data px-2.5 py-2.5 align-top text-mute">{stage.id}</td>
            <td className="px-2.5 py-2.5 align-top text-[15px] leading-snug text-bright">{stage.operation}</td>
            <td className="px-2.5 py-2.5 align-top text-[15px] leading-snug text-mute">{stage.product}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Published values for the survey whose archive the pipeline reads. The motion model above uses its pixel scale. */
function SourceSpecs() {
  return (
    <div className="border-t border-line">
      <PanelHead title="Data source · ZTF" aside="Published values" />
      <dl>
        {ztfSpecs.map((spec, index) => (
          <Readout key={spec.k} label={spec.k} className={cn(index === 0 && 'border-t-0')}>
            <span className="text-body">{spec.v}</span>
          </Readout>
        ))}
      </dl>
    </div>
  );
}
