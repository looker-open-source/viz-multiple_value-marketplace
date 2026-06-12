// © 2019 Google LLC.  All rights reserved.
//
// This software is subject to the Google Cloud Terms of Service, as
// modified by the "General Software Terms" of the Google Cloud Service Specific Terms, available at: https://cloud.google.com/terms/service-terms.

/**
 * Adds a <base target="_parent"> to the head of the document within the iframe
 * If already exists, just set the attribute
 */
export const addBaseTagToHeadElement = doc => {
  const headElement = doc.getElementsByTagName('head')[0];
  let baseElement;

  if (headElement) {
    baseElement = headElement.querySelector('base');
    if (!baseElement) {
      baseElement = headElement.ownerDocument.createElement('base');
      baseElement.setAttribute('target', '_parent');
      headElement.appendChild(baseElement);
    } else {
      baseElement.setAttribute('target', '_parent');
    }
  }
};
