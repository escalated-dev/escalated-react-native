<p align="center">
  <a href="https://escalated.dev"><img src="https://raw.githubusercontent.com/escalated-dev/escalated/main/docs/assets/readme/logo.png" width="72" height="72" alt="Escalated"></a>
</p>

<h1 align="center">Escalated for React Native</h1>

<p align="center">
  Add a customer support area to your React Native app.<br>
  Tickets, a knowledge base and guest tickets, talking to your Escalated backend's REST API.
</p>

<p align="center">
  <a href="https://escalated.dev"><b>Website</b></a> ·
  <a href="https://escalated.dev/docs"><b>Docs</b></a> ·
  <a href="https://escalated.dev/cloud"><b>Cloud</b></a> ·
  <a href="https://github.com/escalated-dev/escalated-react-native/releases"><b>Releases</b></a>
</p>

<br>

## What it does

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>Every support screen, ready to navigate</h3>
      Ticket list, ticket detail with replies and SLA timers, new ticket with attachments, and knowledge base screens, with pre-built React Navigation stacks.
    </td>
    <td width="50%" valign="top">
      <h3>Fits your app instead of fighting it</h3>
      One provider holds your colours, radius, locale and dark mode, and auth hooks let you plug in the sign-in you already have.
    </td>
  </tr>
</table>

## Features

<table>
<tr>
<td width="33%" valign="top">

**Tickets**
- Create, view, filter and reply
- File attachments on tickets and replies
- SLA countdown timers on ticket detail

</td>
<td width="33%" valign="top">

**Self-service**
- Searchable knowledge base
- Post-resolution CSAT star ratings
- Guest tickets without an account

</td>
<td width="33%" valign="top">

**Auth and data**
- Override login, logout, register and token
- React Query fetching and caching

</td>
</tr>
<tr>
<td width="33%" valign="top">

**Navigation**
- Pre-built tab, auth and guest stacks
- Drops into React Navigation

</td>
<td width="33%" valign="top">

**Look and language**
- Dark and light themes with `useTheme`
- English, Spanish, French, German
- Configurable colour, radius, locale and API URL

</td>
<td width="33%" valign="top">

**TypeScript**
- Types for every screen, component and hook
- Typed config options

</td>
</tr>
</table>

<p align="center"><sub><a href="docs/features.md">Every feature in detail</a></sub></p>

<p align="center">
  <a href="https://reactnative.dev"><img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"></a>
  <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tanstack.com/query"><img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white" alt="React Query"></a>
  <a href="https://reactnavigation.org"><img src="https://img.shields.io/badge/React_Navigation-6B52AE?style=for-the-badge" alt="React Navigation"></a>
</p>

## Quick start

```bash
npm install @escalated-dev/escalated-react-native
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context
```

Then wrap your app in `EscalatedProvider` with your API base URL. The [installation guide](docs/installation.md) shows the full setup and every config option.

## Learn more

- [All features](docs/features.md) · [Installation and configuration](docs/installation.md)
- [Screens, components and navigation](docs/screens-and-components.md) · [Auth hooks](docs/auth-hooks.md)
- [Theming](docs/theming.md) · [Internationalization](docs/internationalization.md)
- [Escalated docs](https://escalated.dev/docs)

Escalated is also available for [Flutter](https://github.com/escalated-dev/escalated-flutter), and as a web helpdesk for [Laravel](https://github.com/escalated-dev/escalated-laravel), [Rails](https://github.com/escalated-dev/escalated-rails), [Django](https://github.com/escalated-dev/escalated-django), [NestJS](https://github.com/escalated-dev/escalated-nestjs), [AdonisJS](https://github.com/escalated-dev/escalated-adonis), [Symfony](https://github.com/escalated-dev/escalated-symfony), [Phoenix](https://github.com/escalated-dev/escalated-phoenix), [Go](https://github.com/escalated-dev/escalated-go), [.NET](https://github.com/escalated-dev/escalated-dotnet), [Spring](https://github.com/escalated-dev/escalated-spring), [WordPress](https://github.com/escalated-dev/escalated-wordpress) and [Filament](https://github.com/escalated-dev/escalated-filament).

## License

MIT. Copyright (c) Escalated.dev. See [LICENSE](LICENSE).
