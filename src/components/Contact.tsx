import { useState } from 'react';
import { contactTopics, mailBody, mailTo, person } from '../data/content';
import { zoneClock } from '../lib/format';
import { useNow } from '../lib/useNow';
import { cn } from '../utils/cn';
import { Section } from './Section';
import { Arrow, PanelHead, Readout } from './ui';

/** Current wall-clock time in Tehran, so a caller abroad can pick a sensible hour. */
function TehranClock() {
  const clock = zoneClock(new Date(useNow()), person.timeZone);
  return (
    <>
      {clock.time} <span className="text-dim">{clock.offset}</span>
    </>
  );
}

function CopyAddress() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(person.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button type="button" onClick={handleCopy} className="btn btn-secondary">
      <span aria-live="polite">{copied ? 'Address copied' : 'Copy address'}</span>
    </button>
  );
}

export function Contact() {
  const [topicId, setTopicId] = useState<string>(contactTopics[0].id);
  const topic = contactTopics.find((entry) => entry.id === topicId) ?? contactTopics[0];

  return (
    <Section
      id="contact"
      index="06"
      label="Contact"
      labelFa="تماس"
      title="Research collaboration"
      lede="For university professors, research mentors, astrophysics labs, scientific institutions and technical collaborators. Pick a topic to set the subject line. The draft opens in your own mail client."
    >
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,24rem)]">
        <div className="panel min-w-0">
          <PanelHead title="Message draft" aside="Opens in mail client" />

          <fieldset className="border-b border-line">
            <legend className="sr-only">Topic</legend>
            <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2">
              {contactTopics.map((entry) => {
                const checked = entry.id === topicId;
                return (
                  <label
                    key={entry.id}
                    className={cn(
                      'flex cursor-pointer items-center gap-3 px-3.5 py-3 transition-colors duration-100 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:-outline-offset-2 has-[:focus-visible]:outline-signal',
                      checked ? 'bg-deck text-bright' : 'bg-hull text-mute hover:text-bright',
                    )}
                  >
                    <input
                      type="radio"
                      name="contact-topic"
                      value={entry.id}
                      checked={checked}
                      onChange={() => setTopicId(entry.id)}
                      className="sr-only"
                    />
                    <span
                      aria-hidden="true"
                      className={cn('h-2 w-2 shrink-0 border', checked ? 'border-signal bg-signal' : 'border-line-strong')}
                    />
                    <span className="text-[15px] leading-snug">{entry.label}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <dl>
            <Readout label="To" className="border-t-0">
              <span className="break-all">{person.email}</span>
            </Readout>
            <Readout label="Subject">
              <span className="text-signal">{topic.subject}</span>
            </Readout>
            <Readout label="Body">
              <span className="whitespace-pre-wrap text-mute">{mailBody}</span>
            </Readout>
          </dl>

          <div className="flex flex-col gap-3 border-t border-line p-3.5 sm:flex-row">
            <a href={mailTo(topic.subject, mailBody)} className="btn btn-primary">
              Open email draft
              <Arrow direction="out" />
            </a>
            <CopyAddress />
          </div>
        </div>

        <div className="panel min-w-0 self-start">
          <PanelHead title="Direct contact" />
          <dl>
            <Readout label="Email" className="border-t-0">
              <a href={`mailto:${person.email}`} className="link break-all">
                {person.email}
              </a>
            </Readout>
            <Readout label="Phone">
              <a href={`tel:${person.phoneHref}`} className="link">
                {person.phoneDisplay}
              </a>
            </Readout>
            <Readout label="Location">{person.location}</Readout>
            <Readout label="Local time">
              <TehranClock />
            </Readout>
          </dl>
          <p className="border-t border-line px-3.5 py-3 text-[13px] leading-relaxed text-dim">
            Email is the best first contact. Messages in plain English or in Persian are both welcome.
          </p>
        </div>
      </div>
    </Section>
  );
}
